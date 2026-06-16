'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { showToast } from '../../components/Toast';
import { Search } from 'lucide-react';

export default function ReviewManager() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('전체');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('projects')
      .select('id, title, review_rating, review_text, review_status, advertiser_id, influencer_id, created_at')
      .not('review_text', 'is', null)
      .order('created_at', { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleReviewStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === '제재' ? '정상' : '제재';
    await supabase.from('projects').update({ review_status: newStatus }).eq('id', id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, review_status: newStatus } : r));
    showToast(newStatus === '제재' ? '리뷰가 제재 처리되었습니다.' : '리뷰가 복원되었습니다.', newStatus === '제재' ? 'warning' : 'success');
  };

  const filtered = reviews.filter(r => {
    const matchSearch = !search || r.title?.includes(search) || r.review_text?.includes(search);
    const matchFilter = filter === '전체' || (filter === '제재' && r.review_status === '제재') || (filter === '복원' && r.review_status !== '제재');
    return matchSearch && matchFilter;
  });

  const avgRating = reviews.filter(r => r.review_rating).reduce((sum, r) => sum + r.review_rating, 0) / (reviews.filter(r => r.review_rating).length || 1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800 }}>리뷰 관리</h2>
          <span style={{ fontSize: 13, color: '#FFB800', fontWeight: 700 }}>★ 평균 {avgRating.toFixed(1)}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '6px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }}>
            {['전체', '제재', '복원'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 14, position: 'relative' }}>
        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="프로젝트명, 리뷰 내용 검색" style={{ paddingLeft: 32, fontSize: 13, width: '100%', boxSizing: 'border-box' }} />
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700 }}>
          <thead>
            <tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
              {['No.', '프로젝트명', '평점', '리뷰 내용', '등록일', '관리'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>로딩 중...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>리뷰가 없어요</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{filtered.length - i}</td>
                <td style={{ padding: '10px 12px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.review_status === '제재' ? (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>관리자에 의해 블라인드 처리되었습니다.</span>
                  ) : r.title}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  {r.review_rating ? (
                    <span style={{ color: '#FFB800', fontWeight: 700 }}>{'★'.repeat(Math.floor(r.review_rating))} {r.review_rating}</span>
                  ) : '-'}
                </td>
                <td style={{ padding: '10px 12px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.review_status === '제재' ? (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>블라인드 처리됨</span>
                  ) : r.review_text}
                </td>
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString('ko-KR')}</td>
                <td style={{ padding: '10px 12px' }}>
                  <button onClick={() => toggleReviewStatus(r.id, r.review_status || '정상')}
                    style={{ padding: '4px 12px', borderRadius: 6, border: `1px solid ${r.review_status === '제재' ? '#00C896' : '#FF2D55'}`, background: r.review_status === '제재' ? 'rgba(0,200,150,0.1)' : 'rgba(255,45,85,0.1)', color: r.review_status === '제재' ? '#00C896' : '#FF2D55', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {r.review_status === '제재' ? '복원' : '제재'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          TOTAL {filtered.length} · 평균평점 ★ {avgRating.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
