'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { searchChannels, YoutubeChannel } from '../lib/youtube';
import { Search, Filter, Star, Users, SlidersHorizontal, ChevronDown } from 'lucide-react';

const FOLLOWER_FILTERS = ['전체', '1만 미만', '1만~10만', '10만~50만', '50만~100만', '100만 이상'];
const SORT_OPTIONS = ['팔로워 많은순', '팔로워 적은순', '평점 높은순', '가격 낮은순', '가격 높은순'];
const CATEGORIES = ['전체', '뷰티/패션', '게임', '음식/요리', '여행', '운동', '엔터테인먼트', 'IT/테크', '교육'];

function SearchContent() {
  const params = useSearchParams();
  const initialQuery = params.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [inputVal, setInputVal] = useState(initialQuery);
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [followerFilter, setFollowerFilter] = useState('전체');
  const [sortBy, setSortBy] = useState('팔로워 많은순');
  const [category, setCategory] = useState('전체');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchChannels(query, 12).then(data => {
      setChannels(data);
      setLoading(false);
    });
  }, [query]);

  const handleSearch = () => {
    setQuery(inputVal);
  };

  return (
    <div style={{ display: 'flex', gap: 0, maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, flexShrink: 0, marginRight: 32, display: 'none' }} className="hidden lg:block">
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, position: 'sticky', top: 88 }}>
          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><SlidersHorizontal size={14} /> 필터</h3>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>카테고리</p>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setQuery(cat === '전체' ? (inputVal || '인플루언서') : cat); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6, fontSize: 13, border: 'none', cursor: 'pointer', marginBottom: 2, background: category === cat ? 'rgba(255,45,85,0.12)' : 'transparent', color: category === cat ? '#FF2D55' : 'var(--text-muted)', fontWeight: category === cat ? 600 : 400 }}>
                {cat}
              </button>
            ))}
          </div>

          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>구독자 수</p>
            {FOLLOWER_FILTERS.map(f => (
              <button key={f} onClick={() => setFollowerFilter(f)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6, fontSize: 13, border: 'none', cursor: 'pointer', marginBottom: 2, background: followerFilter === f ? 'rgba(255,45,85,0.12)' : 'transparent', color: followerFilter === f ? '#FF2D55' : 'var(--text-muted)', fontWeight: followerFilter === f ? 600 : 400 }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Search bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={inputVal} onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="채널명, 카테고리로 검색..."
              style={{ paddingLeft: 42, fontSize: 14, height: 44 }} />
          </div>
          <button onClick={handleSearch} style={{ padding: '0 20px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>검색</button>
          <button onClick={() => setFilterOpen(!filterOpen)} style={{ padding: '0 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, flexShrink: 0 }} className="lg:hidden">
            <Filter size={14} /> 필터
          </button>
        </div>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {query ? <><strong style={{ color: 'var(--text)' }}>"{query}"</strong> 검색 결과 <strong style={{ color: '#FF2D55' }}>{channels.length}건</strong></> : '검색어를 입력해주세요'}
          </p>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setSortOpen(!sortOpen)} style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              {sortBy} <ChevronDown size={14} />
            </button>
            {sortOpen && (
              <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 6, minWidth: 160, zIndex: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6, fontSize: 13, border: 'none', cursor: 'pointer', background: sortBy === opt ? 'rgba(255,45,85,0.1)' : 'transparent', color: sortBy === opt ? '#FF2D55' : 'var(--text)' }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile filters */}
        {filterOpen && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20 }} className="lg:hidden">
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>구독자 수</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {FOLLOWER_FILTERS.map(f => (
                <button key={f} onClick={() => setFollowerFilter(f)}
                  style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, border: '1px solid', cursor: 'pointer', borderColor: followerFilter === f ? '#FF2D55' : 'var(--border)', background: followerFilter === f ? 'rgba(255,45,85,0.12)' : 'transparent', color: followerFilter === f ? '#FF2D55' : 'var(--text-muted)' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 200, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : channels.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>검색 결과가 없습니다</p>
            <p style={{ fontSize: 14 }}>다른 검색어나 카테고리를 시도해보세요</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
              {['뷰티', '게임', '여행', '음식'].map(tag => (
                <button key={tag} onClick={() => { setInputVal(tag); setQuery(tag); }}
                  style={{ padding: '8px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 20, cursor: 'pointer', fontSize: 13 }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {channels.map(ch => (
              <Link key={ch.id} href={`/influencer/${ch.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                    <img src={ch.thumbnail} alt={ch.title} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>{ch.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.12)', color: '#FF2D55', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>유튜브</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}><Users size={10} />{ch.subscriberCount}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5 }}>{ch.description || '채널 설명이 없습니다.'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={12} fill="#FFB800" color="#FFB800" />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{ch.rating}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({ch.reviewCount})</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#FF2D55', fontWeight: 700 }}>{ch.estimatedPrice}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>로딩 중...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
