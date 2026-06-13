'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search } from 'lucide-react';

export default function PaymentManager() {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('payments').select('*, profiles!payments_advertiser_id_fkey(name, company)').order('created_at', { ascending: false });
    setList(data || []);
  };
  const updateStatus = async (ids: number[], status: string) => {
    for (const id of ids) await supabase.from('payments').update({ status }).eq('id', id);
    setSelected([]); load();
  };
  const toggleSelect = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(p => p.id));

  const filtered = list.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.profiles?.name?.toLowerCase().includes(q) || p.profiles?.company?.toLowerCase().includes(q);
    const matchStatus = filterStatus === '전체' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800 }}>결제 관리</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12, cursor: 'pointer' }}>
            {['전체', '입금 대기', '입금 완료'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름, 회사명으로 검색..." style={{ paddingLeft: 30, fontSize: 13, padding: '8px 12px 8px 30px', height: 'auto' }} />
        </div>
        {selected.length > 0 && <>
          <button onClick={() => updateStatus(selected, '입금 대기')} style={{ padding: '8px 14px', background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)', color: '#FFB800', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>입금대기 ({selected.length})</button>
          <button onClick={() => updateStatus(selected, '입금 완료')} style={{ padding: '8px 14px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00C896', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>입금완료 ({selected.length})</button>
        </>}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}>
          <thead><tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '10px 12px' }}><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
            {['주문번호', '광고주', '광고금액', '쿠폰', '결제금액', '상태', '신청일'].map(h =>
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>결제 내역이 없어요</td></tr>
              : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', background: selected.includes(p.id) ? 'rgba(255,45,85,0.03)' : 'transparent' }}>
                  <td style={{ padding: '10px 12px' }}><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                  <td style={{ padding: '10px 12px', fontSize: 11, color: 'var(--text-muted)' }}>#{String(p.id).padStart(6, '0')}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{p.profiles?.name || '-'}<br/><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.profiles?.company}</span></td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{p.amount?.toLocaleString()}원</td>
                  <td style={{ padding: '10px 12px', color: '#00C896' }}>{p.coupon_discount ? `-${p.coupon_discount.toLocaleString()}원` : '-'}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#FF2D55' }}>{(p.amount - (p.coupon_discount || 0)).toLocaleString()}원</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: p.status === '입금 완료' ? '#00C896' : '#FFB800', background: p.status === '입금 완료' ? 'rgba(0,200,150,0.1)' : 'rgba(255,184,0,0.1)', padding: '3px 8px', borderRadius: 20 }}>{p.status || '입금 대기'}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>TOTAL {filtered.length} · 총 결제금액 {filtered.reduce((s, p) => s + (p.amount || 0), 0).toLocaleString()}원</p>
    </div>
  );
}
