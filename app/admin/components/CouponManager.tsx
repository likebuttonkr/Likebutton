'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

export default function CouponManager() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', target: '전체', discount_type: '정액식', discount_value: '', start_date: '', end_date: '' });

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons(data || []);
  };
  const save = async () => {
    if (!form.name || !form.discount_value) { alert('쿠폰명과 할인 금액/율을 입력해주세요.'); return; }
    await supabase.from('coupons').insert({ ...form, discount_value: parseInt(form.discount_value), status: '발급전' });
    setForm({ name: '', target: '전체', discount_type: '정액식', discount_value: '', start_date: '', end_date: '' });
    load();
  };
  const toggleIssue = async (id: number, status: string) => {
    await supabase.from('coupons').update({ status: status === '발급중' ? '발급중지' : '발급중' }).eq('id', id);
    load();
  };
  const del = async (id: number) => { if (!confirm('삭제?')) return; await supabase.from('coupons').delete().eq('id', id); load(); };

  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>쿠폰 관리</h2>
      {/* 쿠폰 등록 */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>쿠폰 등록</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>쿠폰명</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="쿠폰명" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>대상</label>
            <select value={form.target} onChange={e => setForm(f => ({...f, target: e.target.value}))}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
              {['전체', '유튜브', '인스타그램', '틱톡'].map(t => <option key={t}>{t}</option>)}
            </select></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>할인 종류</label>
            <select value={form.discount_type} onChange={e => setForm(f => ({...f, discount_type: e.target.value}))}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
              {['정액식', '정률식'].map(t => <option key={t}>{t}</option>)}
            </select></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>할인 {form.discount_type === '정률식' ? '율(%)' : '금액(원)'}</label>
            <input type="number" value={form.discount_value} onChange={e => setForm(f => ({...f, discount_value: e.target.value}))} placeholder={form.discount_type === '정률식' ? '10' : '10000'} style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>유효기간 시작</label>
            <input type="date" value={form.start_date} onChange={e => setForm(f => ({...f, start_date: e.target.value}))} style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>유효기간 종료</label>
            <input type="date" value={form.end_date} onChange={e => setForm(f => ({...f, end_date: e.target.value}))} style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} /></div>
        </div>
        <button onClick={save} style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>등록</button>
      </div>

      {/* 쿠폰 목록 */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
          <thead><tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
            {['No.', '쿠폰명', '대상', '할인', '유효기간', '상태', '관리'].map(h =>
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {coupons.length === 0 ? <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>등록된 쿠폰이 없어요</td></tr>
            : coupons.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{coupons.length - i}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{c.target}</td>
                <td style={{ padding: '10px 12px', color: '#FF2D55', fontWeight: 600 }}>{c.discount_type === '정률식' ? `${c.discount_value}%` : `${c.discount_value?.toLocaleString()}원`}</td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-muted)' }}>{c.start_date || '-'} ~ {c.end_date || '-'}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.status === '발급중' ? '#00C896' : 'var(--text-muted)', background: c.status === '발급중' ? 'rgba(0,200,150,0.1)' : 'var(--bg-card2)', padding: '3px 8px', borderRadius: 20 }}>{c.status || '발급전'}</span>
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggleIssue(c.id, c.status)}
                      style={{ padding: '4px 10px', background: c.status === '발급중' ? 'rgba(255,45,85,0.08)' : 'rgba(0,200,150,0.1)', border: `1px solid ${c.status === '발급중' ? 'rgba(255,45,85,0.2)' : 'rgba(0,200,150,0.3)'}`, color: c.status === '발급중' ? '#FF2D55' : '#00C896', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      {c.status === '발급중' ? '중지' : '발급'}
                    </button>
                    <button onClick={() => del(c.id)} style={{ padding: '4px 8px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 6, cursor: 'pointer' }}><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
