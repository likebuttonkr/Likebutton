'use client';
import { showToast } from '../../components/Toast';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search } from 'lucide-react';

export default function AdvertiserManager() {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterApproval, setFilterApproval] = useState('전체');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [saving, setSaving] = useState<number|null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('user_type', 'advertiser').order('created_at', { ascending: false });
    setList(data || []);
  };

  const updateApproval = async (id: string, approval: string) => {
    setSaving(Number(id));
    await supabase.from('profiles').update({ approval_status: approval }).eq('id', id);
    await load();
    setSaving(null);
    if (approval === '승인완료') showToast('승인 완료 이메일이 발송되었습니다.', 'success');
    if (approval === '승인거절') showToast('거절 이메일이 발송되었습니다.', 'error');
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('profiles').update({ account_status: status }).eq('id', id);
    load();
  };

  const filtered = list.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.email?.includes(q) || u.name?.includes(q) || u.company?.includes(q);
    const matchApproval = filterApproval === '전체' || u.approval_status === filterApproval;
    const matchStatus = filterStatus === '전체' || u.account_status === filterStatus || (!u.account_status && filterStatus === '정상');
    return matchSearch && matchApproval && matchStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800 }}>광고주 관리</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filterApproval} onChange={e => setFilterApproval(e.target.value)}
            style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12, cursor: 'pointer' }}>
            {['전체', '승인대기', '승인완료', '승인거절'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12, cursor: 'pointer' }}>
            {['전체', '정상', '제재', '탈퇴'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* 승인대기 강조 영역 */}
      {list.filter(u => !u.approval_status || u.approval_status === '승인대기').length > 0 && (
        <div style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <p style={{ fontSize: 13, color: '#FFB800', fontWeight: 600 }}>
            승인 대기 중인 광고주가 {list.filter(u => !u.approval_status || u.approval_status === '승인대기').length}명 있어요
          </p>
        </div>
      )}

      {/* 검색 */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이메일, 회사명, 이름으로 검색..."
          style={{ paddingLeft: 34, fontSize: 13, padding: '9px 12px 9px 34px', height: 'auto' }} />
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}>
          <thead><tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
            {['No.', '아이디', '회사명', '이름', '승인', '상태', '가입일', '관리'].map(h =>
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>광고주가 없어요</td></tr>
              : filtered.map((user, i) => {
                const approval = user.approval_status || '승인대기';
                const status = user.account_status || '정상';
                const approvalColor = approval === '승인완료' ? '#00C896' : approval === '승인거절' ? '#FF2D55' : '#FFB800';
                const approvalBg = approval === '승인완료' ? 'rgba(0,200,150,0.1)' : approval === '승인거절' ? 'rgba(255,45,85,0.1)' : 'rgba(255,184,0,0.1)';
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{filtered.length - i}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12 }}>{user.email}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{user.company || '-'}</td>
                    <td style={{ padding: '10px 12px' }}>{user.name || '-'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: approvalColor, background: approvalBg, padding: '3px 8px', borderRadius: 20 }}>{approval}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: status === '정상' ? '#00C896' : '#FF2D55', background: status === '정상' ? 'rgba(0,200,150,0.1)' : 'rgba(255,45,85,0.1)', padding: '3px 8px', borderRadius: 20 }}>{status}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(user.created_at).toLocaleDateString('ko-KR')}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {approval !== '승인완료' && <button onClick={() => updateApproval(user.id, '승인완료')} disabled={saving === Number(user.id)}
                          style={{ padding: '3px 8px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00C896', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>승인</button>}
                        {approval !== '승인거절' && <button onClick={() => updateApproval(user.id, '승인거절')} disabled={saving === Number(user.id)}
                          style={{ padding: '3px 8px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>거절</button>}
                        {status === '정상' ? <button onClick={() => updateStatus(user.id, '제재')}
                          style={{ padding: '3px 8px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>제재</button>
                        : <button onClick={() => updateStatus(user.id, '정상')}
                          style={{ padding: '3px 8px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>복원</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>TOTAL {filtered.length}</p>
    </div>
  );
}
