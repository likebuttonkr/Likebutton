'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search } from 'lucide-react';
import { showToast } from '../../components/Toast';

export default function WithdrawalManager() {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [selected, setSelected] = useState<number[]>([]);

  const downloadExcel = () => {
    const header = ['인플루언서', '출금신청금액', '입금은행', '계좌번호', '예금주', '상태', '신청일시', '완료일시'];
    const rows = list.map(w => [
      w.influencer_id || '-', w.amount || 0, w.bank_name || '-',
      w.account_number || '-', w.account_holder || '-',
      w.status || '-', new Date(w.created_at).toLocaleString('ko-KR'),
      w.completed_at ? new Date(w.completed_at).toLocaleString('ko-KR') : '-',
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `출금내역_${new Date().toLocaleDateString('ko-KR')}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('엑셀 파일이 다운로드되었습니다.', 'success');
  };

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('withdrawals').select('*, profiles(name)').order('created_at', { ascending: false });
    setList(data || []);
  };
  const updateStatus = async (ids: number[], status: string) => {
    for (const id of ids) await supabase.from('withdrawals').update({ status, completed_at: status === '출금 완료' ? new Date().toISOString() : null }).eq('id', id);
    setSelected([]); load();
  };
  const toggleSelect = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(w => w.id));

  const filtered = list.filter(w => {
    const q = search.toLowerCase();
    const matchSearch = !q || w.profiles?.name?.toLowerCase().includes(q);
    const matchStatus = filterStatus === '전체' || w.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800 }}>출금 관리</h2>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12, cursor: 'pointer' }}>
          {['전체', '출금 신청', '출금 완료'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* 출금 신청 강조 */}
      {list.filter(w => w.status === '출금 신청').length > 0 && (
        <div style={{ background: 'rgba(91,141,239,0.08)', border: '1px solid rgba(91,141,239,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: '#5B8DEF', fontWeight: 600 }}>💰 출금 신청 대기 중: {list.filter(w => w.status === '출금 신청').length}건 · {list.filter(w => w.status === '출금 신청').reduce((s, w) => s + (w.amount || 0), 0).toLocaleString()}원</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름으로 검색..." style={{ paddingLeft: 30, fontSize: 13, padding: '8px 12px 8px 30px', height: 'auto' }} />
        </div>
        {selected.length > 0 && <>
          <button onClick={() => updateStatus(selected, '출금 완료')} style={{ padding: '8px 14px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00C896', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>출금완료 ({selected.length})</button>
        </>}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
          <thead><tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '10px 12px' }}><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
            {['No.', '인플루언서', '출금 신청액', '은행', '계좌번호', '예금주', '상태', '신청일'].map(h =>
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>출금 신청이 없어요</td></tr>
              : filtered.map((w, i) => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--border)', background: selected.includes(w.id) ? 'rgba(0,200,150,0.03)' : 'transparent' }}>
                  <td style={{ padding: '10px 12px' }}><input type="checkbox" checked={selected.includes(w.id)} onChange={() => toggleSelect(w.id)} /></td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{filtered.length - i}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{w.profiles?.name || '-'}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#FF2D55' }}>{w.amount?.toLocaleString()}원</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{w.bank_name || '-'}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: 12 }}>{w.account_number || '-'}</td>
                  <td style={{ padding: '10px 12px' }}>{w.account_holder || '-'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: w.status === '출금 완료' ? '#00C896' : '#5B8DEF', background: w.status === '출금 완료' ? 'rgba(0,200,150,0.1)' : 'rgba(91,141,239,0.1)', padding: '3px 8px', borderRadius: 20 }}>{w.status || '출금 신청'}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(w.created_at).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>TOTAL {filtered.length} · 출금 신청 {list.filter(w => w.status !== '출금 완료').reduce((s, w) => s + (w.amount || 0), 0).toLocaleString()}원 · 출금 완료 {list.filter(w => w.status === '출금 완료').reduce((s, w) => s + (w.amount || 0), 0).toLocaleString()}원</p>
    </div>
  );
}
