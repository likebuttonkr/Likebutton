'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import { getTrendingVideos, searchChannels, YoutubeVideo, YoutubeChannel } from './lib/youtube';
import { Search, TrendingUp, Star, Users, Play, ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const BANNERS = [
  { title: '인플루언서 마케팅의\n새로운 기준', sub: '유튜브·인스타그램·틱톡 인플루언서를\n한 곳에서 찾고, 계약하고, 관리하세요.', cta: '인플루언서 검색하기', href: '/search', gradient: 'linear-gradient(135deg, #FF2D55 0%, #FF6B35 100%)' },
  { title: '안전결제로\n믿을 수 있는 거래', sub: '계약서 작성부터 정산까지\n플랫폼이 안전하게 보장합니다.', cta: '더 알아보기', href: '/about', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { title: '실시간 트렌드\n분석 서비스', sub: '급상승 인플루언서와 검색 트렌드를\n지금 바로 확인해보세요.', cta: '트렌드 보기', href: '/trends', gradient: 'linear-gradient(135deg, #00C896 0%, #0099CC 100%)' },
];

const STATS = [
  { label: '등록 인플루언서', value: '12,400+', icon: '👤' },
  { label: '완료 프로젝트', value: '38,000+', icon: '✅' },
  { label: '파트너 브랜드', value: '2,100+', icon: '🏢' },
  { label: '플랫폼 거래액', value: '240억+', icon: '💰' },
];

const CATEGORIES = [
  { name: '뷰티/패션', icon: '💄', count: '2,340' },
  { name: '음식/요리', icon: '🍳', count: '1,820' },
  { name: '게임', icon: '🎮', count: '1,560' },
  { name: '여행', icon: '✈️', count: '980' },
  { name: '운동/스포츠', icon: '💪', count: '870' },
  { name: '엔터테인먼트', icon: '🎬', count: '1,200' },
  { name: 'IT/테크', icon: '💻', count: '740' },
  { name: '교육', icon: '📚', count: '650' },
];

export default function Home() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [trending, setTrending] = useState<YoutubeVideo[]>([]);
  const [featured, setFeatured] = useState<YoutubeChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function load() {
      const [tv, fc] = await Promise.all([
        getTrendingVideos(8),
        searchChannels('한국 인플루언서', 8),
      ]);
      setTrending(tv);
      setFeatured(fc);
      setLoading(false);
    }
    load();
  }, []);

  const banner = BANNERS[bannerIdx];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      {/* Hero Banner */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 480 }}>
        <div style={{ position: 'absolute', inset: 0, background: banner.gradient, opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(255,45,85,0.08) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 60px', position: 'relative', display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,45,85,0.12)', border: '1px solid rgba(255,45,85,0.3)', borderRadius: 20, padding: '4px 12px', marginBottom: 20 }}>
              <Zap size={12} color="#FF2D55" />
              <span style={{ fontSize: 12, color: '#FF2D55', fontWeight: 600 }}>인플루언서 마케팅 플랫폼</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, whiteSpace: 'pre-line', letterSpacing: '-1px' }}>{banner.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 32, whiteSpace: 'pre-line' }}>{banner.sub}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={banner.href} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {banner.cta} <ArrowRight size={16} />
              </Link>
              <Link href="/signup" style={{ padding: '14px 28px', background: 'transparent', color: 'var(--text)', textDecoration: 'none', borderRadius: 10, fontWeight: 600, fontSize: 15, border: '1px solid var(--border)' }}>
                무료로 시작하기
              </Link>
            </div>
          </div>
          {/* Search box */}
          <div style={{ flex: 1, minWidth: 300, maxWidth: 440 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>빠른 인플루언서 검색</p>
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') window.location.href = `/search?q=${searchQuery}`; }}
                  placeholder="채널명, 카테고리 검색..."
                  style={{ paddingLeft: 38, fontSize: 14 }} />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {['뷰티', '게임', '음식', '여행', '운동'].map(tag => (
                  <button key={tag} onClick={() => window.location.href = `/search?q=${tag}`}
                    style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 20, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}
                    className="hover:border-pink-500 hover:text-white transition-all">{tag}</button>
                ))}
              </div>
              <button onClick={() => window.location.href = `/search?q=${searchQuery}`}
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                검색하기
              </button>
            </div>
          </div>
        </div>
        {/* Banner nav */}
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setBannerIdx(i => (i - 1 + BANNERS.length) % BANNERS.length)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={14} /></button>
          {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setBannerIdx(i)} style={{ width: i === bannerIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === bannerIdx ? '#FF2D55' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
          <button onClick={() => setBannerIdx(i => (i + 1) % BANNERS.length)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={14} /></button>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, color: '#FF2D55', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>카테고리별 인플루언서</h2>
          <Link href="/search" style={{ color: '#FF2D55', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>전체 보기 <ArrowRight size={14} /></Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.name} href={`/search?q=${cat.name}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '20px 12px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cat.count}명</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Channels */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>급상승 인플루언서</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>YouTube에서 인기 급상승 중인 채널</p>
          </div>
          <Link href="/search" style={{ color: '#FF2D55', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>전체 보기 <ArrowRight size={14} /></Link>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card" style={{ padding: 20, height: 180, background: 'var(--bg-card2)' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--border)', marginBottom: 12, animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: 14, width: '60%', background: 'var(--border)', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 12, width: '40%', background: 'var(--border)', borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {featured.map(ch => (
              <Link key={ch.id} href={`/influencer/${ch.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                    <img src={ch.thumbnail} alt={ch.title} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ch.subscriberCount} 구독자</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5 }}>{ch.description || '채널 설명이 없습니다.'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={12} fill="#FFB800" color="#FFB800" />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{ch.rating}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({ch.reviewCount})</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#FF2D55', fontWeight: 700 }}>{ch.estimatedPrice}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trending Videos */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={20} color="#FF2D55" /> 인기 광고 영상
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>현재 유튜브 인기 급상승 영상</p>
          </div>
          <Link href="/trends" style={{ color: '#FF2D55', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>더 보기 <ArrowRight size={14} /></Link>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[...Array(4)].map((_, i) => <div key={i} style={{ height: 220, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {trending.slice(0, 8).map((v, idx) => (
              <a key={v.id} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,45,85,0.9)', color: 'white', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>#{idx + 1}</div>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', background: 'rgba(0,0,0,0.4)' }} className="hover:opacity-100">
                      <Play size={32} color="white" fill="white" />
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4, color: 'var(--text)' }}>{v.title}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.channelTitle}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><Play size={10} />{v.viewCount}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1280, margin: '60px auto 0', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(255,45,85,0.15) 0%, rgba(255,107,53,0.1) 100%)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 20, padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, marginBottom: 12 }}>지금 바로 시작하세요</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>광고주라면 원하는 인플루언서를 찾고,<br />인플루언서라면 내 채널을 등록하세요.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup?type=advertiser" style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>광고주로 시작하기</Link>
            <Link href="/signup?type=influencer" style={{ padding: '14px 32px', background: 'transparent', color: 'var(--text)', textDecoration: 'none', borderRadius: 10, fontWeight: 600, fontSize: 15, border: '1px solid var(--border)' }}>인플루언서로 등록하기</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
