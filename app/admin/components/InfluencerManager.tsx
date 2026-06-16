'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { showToast } from '../../components/Toast';
import { Search, ChevronLeft, ExternalLink, Download } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  '정상': '#00C896', '제재': '#FF2D55', '탈퇴': '#888', '강제탈퇴': '#FF2D55',
};

export default function InfluencerManager() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const [statusFilter, setStatusFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [selected, setSelected] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('user_type', 'influencer').order('created_at', { ascending: false });
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = list.filter(u => {
    const matchSearch = !searchQ || u.email?.includes(searchQ) || u.name?.includes(searchQ) || u.channel_name?.includes(searchQ) || u.phone?.includes(searchQ);
    const matchStatus = statusFilter === '전체' || (u.account_status || '정상') === statusFilter;
    const matchCat = categoryFilter === '전체' || (u.categories || []).some((c: string) => c.includes(categoryFilter));
    return matchSearch && matchStatus && matchCat;
  });

  const updateStatus = async (id: string, status: string) => {
    setSaving(true);
    await supabase.from('profiles').update({ account_status: status }).eq('id', id);
    if (selected?.id === id) setSelected((s: any) => ({ ...s, account_status: status }));
    await load();
    setSaving(false);
    showToast(`상태가 '${status}'로 변경되었습니다.`, 'success');
  };

  const exportExcel = () => {
    const rows = [
      ['No.', '아이디', '닉네임', '이름', '휴대폰', '카테고리', '서비스', '프로젝트', '수익금', '상태', '가입일'],
      ...filtered.map((u, i) => [
        filtered.length - i, u.email, u.name, u.full_name, u.phone,
        (u.categories || []).join('/'), '-', '-', '-',
        u.account_status || '정상',
        new Date(u.created_at).toLocaleDateString('ko-KR'),
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `인플루언서목록_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    showToast('엑셀 파일이 다운로드되었습니다.', 'success');
  };

  // 상세 화면
  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, marginBottom: 16, padding: 0 }}>
          <ChevronLeft size={15} /> 목록으로
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          {/* 기본 정보 */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: selected.avatar_url ? `url(${selected.avatar_url}) center/cover` : 'linear-gradient(135deg,#FF2D55,#FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {!selected.avatar_url && (selected.name || '?')[0]}
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800 }}>{selected.name || '-'}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selected.email}</p>
              </div>
            </div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>기본 정보</h3>
            {[
              { label: '아이디', value: selected.email },
              { label: '닉네임', value: selected.name },
              { label: '이름', value: selected.full_name || '-' },
              { label: '휴대폰', value: selected.phone || '-' },
              { label: '업무 이메일', value: selected.biz_email || '-' },
              { label: '활동 카테고리', value: (selected.categories || []).join(', ') || '-' },
              { label: '수신 동의', value: '이메일 ○  SMS ○' },
              { label: '가입일', value: new Date(selected.created_at).toLocaleString('ko-KR') },
            ].map(info => (
              <div key={info.label} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)', minWidth: 100, flexShrink: 0 }}>{info.label}</span>
                <span style={{ fontWeight: 500 }}>{info.value}</span>
              </div>
            ))}
          </div>
          {/* 상태 + 활동 정보 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>상태 관리</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['정상', '제재', '탈퇴', '강제탈퇴'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={saving}
                    style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${(selected.account_status || '정상') === s ? STATUS_COLOR[s] : 'var(--border)'}`, background: (selected.account_status || '정상') === s ? `${STATUS_COLOR[s]}18` : 'transparent', color: (selected.account_status || '정상') === s ? STATUS_COLOR[s] : 'var(--text-muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>SNS 인증</h3>
              {selected.channel_name ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13 }}>📺 {selected.channel_name}</span>
                  {selected.channel_url && <a href={selected.channel_url} target="_blank" rel="noreferrer"><ExternalLink size={13} color="#5B8DEF" /></a>}
                </div>
              ) : <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>SNS 미인증</p>}
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>활동 정보</h3>
              {[
                { label: 'SNS 인증 (누적)', value: selected.channel_name ? '1건' : '-' },
                { label: '서비스 (누적)', value: '조회 중...' },
                { label: '프로젝트 (누적)', value: '조회 중...' },
                { label: '평점 (누적)', value: '-' },
                { label: 'Q&A (누적)', value: '조회 중...' },
                { label: '출금 완료 수익금', value: '-' },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{info.label}</span>
                  <span style={{ fontWeight: 600 }}>{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={() => setSelected(null)} style={{ padding: '8px 18px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', cursor: 'pointer', fontSize: 13 }}>목록으로</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800 }}>인플루언서 관리</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12, cursor: 'pointer' }}>
            {['전체', '뷰티/패션', '음식/요리', '게임', '여행', '운동', 'IT/테크', '교육', '라이프스타일'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12, cursor: 'pointer' }}>
            {['전체', '정상', '제재', '탈퇴', '강제탈퇴'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={exportExcel} style={{ padding: '6px 12px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 8, color: '#00C896', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Download size={12} /> 엑셀
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="이메일, 닉네임, 이름, 휴대폰 검색" style={{ paddingLeft: 32, fontSize: 13 }} />
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 900 }}>
          <thead>
            <tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
              {['No.', '아이디', '닉네임', '이름', '휴대폰', '카테고리', 'SNS인증', '서비스', '프로젝트', '수익금', '상태', '가입일'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={12} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>로딩 중...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={12} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>인플루언서가 없어요</td></tr>
            ) : filtered.map((u, i) => (
              <tr key={u.id} onClick={() => setSelected(u)} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{filtered.length - i}</td>
                <td style={{ padding: '10px 12px', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{u.name || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{u.full_name || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{u.phone || '-'}</td>
                <td style={{ padding: '10px 12px', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(u.categories || []).join(', ') || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{u.channel_name ? <span style={{ color: '#00C896', fontWeight: 600 }}>✓</span> : '-'}</td>
                <td style={{ padding: '10px 12px' }}>-</td>
                <td style={{ padding: '10px 12px' }}>-</td>
                <td style={{ padding: '10px 12px' }}>-</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[u.account_status || '정상'], background: `${STATUS_COLOR[u.account_status || '정상']}18`, padding: '2px 8px', borderRadius: 10 }}>
                    {u.account_status || '정상'}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString('ko-KR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          TOTAL {filtered.length}
        </div>
      </div>
    </div>
  );
}
