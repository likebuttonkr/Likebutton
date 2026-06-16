'use client';
import { showToast } from '../../components/Toast';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, ChevronLeft, Download, ExternalLink } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  '정상': '#00C896', '제재': '#FF2D55', '탈퇴': '#888', '강제탈퇴': '#FF2D55',
};
const APPROVAL_COLOR: Record<string, string> = {
  '승인대기': '#FFB800', '승인완료': '#00C896', '승인거절': '#FF2D55',
};

export default function AdvertiserManager() {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterApproval, setFilterApproval] = useState('전체');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const [filterStatus, setFilterStatus] = useState('전체');
  const [filterIndustry, setFilterIndustry] = useState('전체');
  const [saving, setSaving] = useState<string|null>(null);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('user_type', 'advertiser').order('created_at', { ascending: false });
    setList(data || []);
  };

  const updateApproval = async (id: string, approval: string) => {
    setSaving(id);
    await supabase.from('profiles').update({ approval_status: approval }).eq('id', id);
    const user = list.find(u => u.id === id);
    if (user?.email) {
      await supabase.from('email_history').insert({
        target: user.email,
        content: approval === '승인완료'
          ? `[라이크버튼] 광고주 가입 승인 완료\n\n안녕하세요 ${user.name || user.email}님,\n라이크버튼 광고주 가입이 승인되었습니다.`
          : `[라이크버튼] 광고주 가입 승인 거절\n\n안녕하세요 ${user.name || user.email}님,\n광고주 가입이 거절되었습니다.`,
      });
    }
    if (selected?.id === id) setSelected((s: any) => ({ ...s, approval_status: approval }));
    await load();
    setSaving(null);
    showToast(approval === '승인완료' ? '승인 완료 이메일이 발송되었습니다.' : '거절 이메일이 발송되었습니다.', approval === '승인완료' ? 'success' : 'error');
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('profiles').update({ account_status: status }).eq('id', id);
    if (selected?.id === id) setSelected((s: any) => ({ ...s, account_status: status }));
    load();
    showToast(`상태가 '${status}'로 변경되었습니다.`, 'success');
  };

  const filtered = list.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.email?.includes(q) || u.name?.includes(q) || u.company?.includes(q) || u.phone?.includes(q);
    const matchApproval = filterApproval === '전체' || (u.approval_status || '승인대기') === filterApproval;
    const matchStatus = filterStatus === '전체' || (u.account_status || '정상') === filterStatus;
    const matchIndustry = filterIndustry === '전체' || u.industry === filterIndustry;
    return matchSearch && matchApproval && matchStatus && matchIndustry;
  });

  const exportExcel = () => {
    const rows = [
      ['No.', '아이디', '회사명', '이름', '휴대폰', '업종', '프로젝트', '결제금액', '승인', '상태', '가입일'],
      ...filtered.map((u, i) => [
        filtered.length - i, u.email, u.company, u.name, u.phone,
        u.industry || '-', '-', '-',
        u.approval_status || '승인대기',
        u.account_status || '정상',
        new Date(u.created_at).toLocaleDateString('ko-KR'),
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `광고주목록_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    showToast('엑셀 파일이 다운로드되었습니다.', 'success');
  };

  // 상세
  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, marginBottom: 16, padding: 0 }}>
          <ChevronLeft size={15} /> 목록으로
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white' }}>
                {(selected.company || selected.name || '?')[0]}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800 }}>{selected.company || selected.name || '-'}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selected.email}</p>
              </div>
            </div>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>기본 정보</h3>
            {[
              { label: '아이디', value: selected.email },
              { label: '회사명', value: selected.company || '-' },
              { label: '이름', value: selected.name || '-' },
              { label: '휴대폰', value: selected.phone || '-' },
              { label: '업무 이메일', value: selected.biz_email || '-' },
              { label: '업종', value: selected.industry || '-' },
              { label: '홈페이지', value: selected.website || '-' },
              { label: '사업자등록증', value: selected.biz_doc_url ? '첨부됨' : '-' },
              { label: '관심 카테고리', value: (selected.categories || []).join(', ') || '-' },
              { label: '가입일', value: new Date(selected.created_at).toLocaleString('ko-KR') },
            ].map(info => (
              <div key={info.label} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)', minWidth: 100, flexShrink: 0 }}>{info.label}</span>
                <span style={{ fontWeight: 500 }}>
                  {info.label === '홈페이지' && selected.website
                    ? <a href={selected.website} target="_blank" rel="noreferrer" style={{ color: '#5B8DEF', display: 'flex', alignItems: 'center', gap: 4 }}>{selected.website} <ExternalLink size={11} /></a>
                    : info.label === '사업자등록증' && selected.biz_doc_url
                    ? <a href={selected.biz_doc_url} target="_blank" rel="noreferrer" style={{ color: '#5B8DEF' }}>보기</a>
                    : info.value}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>승인 관리</h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {['승인대기', '승인완료', '승인거절'].map(s => (
                  <button key={s} onClick={() => updateApproval(selected.id, s)} disabled={saving === selected.id}
                    style={{ flex: 1, padding: '7px 8px', borderRadius: 8, border: `1px solid ${(selected.approval_status || '승인대기') === s ? APPROVAL_COLOR[s] : 'var(--border)'}`, background: (selected.approval_status || '승인대기') === s ? `${APPROVAL_COLOR[s]}18` : 'transparent', color: (selected.approval_status || '승인대기') === s ? APPROVAL_COLOR[s] : 'var(--text-muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>상태 관리</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['정상', '제재', '탈퇴', '강제탈퇴'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${(selected.account_status || '정상') === s ? STATUS_COLOR[s] : 'var(--border)'}`, background: (selected.account_status || '정상') === s ? `${STATUS_COLOR[s]}18` : 'transparent', color: (selected.account_status || '정상') === s ? STATUS_COLOR[s] : 'var(--text-muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>활동 정보</h3>
              {[
                { label: '프로젝트 (누적)', value: '조회 중...' },
                { label: '리뷰 (누적)', value: '조회 중...' },
                { label: 'Q&A (누적)', value: '조회 중...' },
                { label: '결제 금액 (누적)', value: '조회 중...' },
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
        <h2 style={{ fontSize: 17, fontWeight: 800 }}>광고주 관리</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}
            style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }}>
            {['전체', 'IT/소프트웨어', '게임', '뷰티/화장품', '패션/의류', '식품/음료', '유통/커머스', '금융', '헬스케어', '교육', '엔터테인먼트'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterApproval} onChange={e => setFilterApproval(e.target.value)}
            style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }}>
            {['전체', '승인대기', '승인완료', '승인거절'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }}>
            {['전체', '정상', '제재', '탈퇴', '강제탈퇴'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={exportExcel} style={{ padding: '6px 12px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 8, color: '#00C896', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Download size={12} /> 엑셀
          </button>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이메일, 회사명, 이름, 휴대폰 검색" style={{ paddingLeft: 32, fontSize: 13, width: '100%', boxSizing: 'border-box' }} />
        </div>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 900 }}>
          <thead>
            <tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
              {['No.', '아이디', '회사명', '이름', '휴대폰', '업종', '프로젝트', '결제금액', '승인', '상태', '가입일'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>광고주가 없어요</td></tr>
            ) : filtered.map((u, i) => (
              <tr key={u.id} onClick={() => setSelected(u)} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{filtered.length - i}</td>
                <td style={{ padding: '10px 12px', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{u.company || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{u.name || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{u.phone || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{u.industry || '-'}</td>
                <td style={{ padding: '10px 12px' }}>-</td>
                <td style={{ padding: '10px 12px' }}>-</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: APPROVAL_COLOR[u.approval_status || '승인대기'], background: `${APPROVAL_COLOR[u.approval_status || '승인대기']}18`, padding: '2px 8px', borderRadius: 10 }}>
                    {u.approval_status || '승인대기'}
                  </span>
                </td>
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
