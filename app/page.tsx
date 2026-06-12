'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import { getTrendingVideos, searchChannels, YoutubeVideo, YoutubeChannel } from './lib/youtube';
import { Search, TrendingUp, Play, Users, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BANNERS = [
  { title: '안전결제로\n믿을 수 있는 거래', sub: '계약서 작성부터 정산까지\n플랫폼이 안전하게 보장합니다.', color: 'from-[#FF2D55] to-[#FF6B35]', emoji: '🔒' },
  { title: '5만+ 인플루언서와\n함께하세요', sub: '유튜브, 인스타그램, 틱톡\n최적의 크리에이터를 찾아드립니다.', color: 'from-[#5B8DEF] to-[#8B5CF6]', emoji: '🎬' },
  { title: '데이터 기반\n정확한 매칭', sub: '구독자 연령, 성별, 조회수 분석으로\n딱 맞는 인플루언서를 추천합니다.', color: 'from-[#00C896] to-[#5B8DEF]', emoji: '📊' },
];

const CATEGORIES = [
  { label: '뷰티', icon: '💄', query: '뷰티' },
  { label: '게임', icon: '🎮', query: '게임' },
  { label: '음식', icon: '🍳', query: '음식' },
  { label: '여행', icon: '✈️', query: '여행' },
  { label: '운동', icon: '💪', query: '운동' },
  { label: 'IT', icon: '💻', query: 'IT 테크' },
  { label: '패션', icon: '👗', query: '패션' },
  { label: '교육', icon: '📚', query: '교육' },
];

export default function MainPage() {
  const router = useRouter();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [searchVal, setSearchVal] = useState('');
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([getTrendingVideos(8), searchChannels('한국 인기 유튜브', 8)])
      .then(([v, c]) => { setVideos(v); setChannels(c); setLoading(false); });
  }, []);

  const banner = BANNERS[bannerIdx];

  return (
    <div>
      <Header />

      {/* Hero Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a14 100%)', padding: isMobile ? '40px 16px' : '64px 24px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 400px', gap: isMobile ? 32 : 48, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,45,85,0.15)', border: '1px solid rgba(255,45,85,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#FF2D55', marginBottom: 20 }}>
              ⚡ 인플루언서 마케팅 플랫폼
            </span>
            <h1 style={{ fontSize: isMobile ? 32 : 48, fontWeight: 900, lineHeight: 1.15, marginBottom: 16, whiteSpace: 'pre-line' }}>
              {banner.title}
            </h1>
            <p style={{ fontSize: isMobile ? 14 : 16, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32, whiteSpace: 'pre-line' }}>
              {banner.sub}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/about" style={{ padding: isMobile ? '11px 20px' : '13px 28px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: isMobile ? 14 : 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                더 알아보기 <ArrowRight size={16} />
              </Link>
              <Link href="/signup" style={{ padding: isMobile ? '11px 20px' : '13px 28px', background: 'transparent', color: 'var(--text)', textDecoration: 'none', borderRadius: 10, fontWeight: 600, fontSize: isMobile ? 14 : 15, border: '1px solid var(--border)' }}>
                무료로 시작하기
              </Link>
            </div>
            {/* Banner dots */}
            <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
              {BANNERS.map((_, i) => (
                <button key={i} onClick={() => setBannerIdx(i)}
                  style={{ width: i === bannerIdx ? 20 : 8, height: 8, borderRadius: 4, background: i === bannerIdx ? '#FF2D55' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
              ))}
            </div>
          </div>

          {/* Right: Search box */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 20, padding: isMobile ? 20 : 28, backdropFilter: 'blur(10px)' }}>
            <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>빠른 인플루언서 검색</p>
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && router.push(`/search?q=${searchVal}`)}
                placeholder="채널명, 카테고리 검색..." style={{ paddingLeft: 36, fontSize: 14 }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {CATEGORIES.slice(0, 5).map(cat => (
                <button key={cat.label} onClick={() => router.push(`/search?q=${cat.query}`)}
                  style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            <button onClick={() => router.push(`/search?q=${searchVal}`)}
              style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              검색하기
            </button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '48px 24px' }}>

        {/* Category chips */}
        <section style={{ marginBottom: isMobile ? 40 : 56 }}>
          <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, marginBottom: 16 }}>카테고리</h2>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 4 : 8}, 1fr)`, gap: isMobile ? 8 : 12 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.label} href={`/search?q=${cat.query}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: isMobile ? '12px 6px' : '16px 8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, transition: 'all 0.2s' }}>
                <span style={{ fontSize: isMobile ? 22 : 28 }}>{cat.icon}</span>
                <span style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: 'var(--text-muted)' }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 급상승 채널 */}
        <section style={{ marginBottom: isMobile ? 40 : 56 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              🚀 급상승 채널
            </h2>
            <Link href="/search" style={{ fontSize: 13, color: '#FF2D55', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>더보기 <ArrowRight size={13} /></Link>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: 12 }}>
              {[...Array(isMobile ? 4 : 4)].map((_, i) => <div key={i} style={{ height: 140, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: 12 }}>
              {channels.slice(0, isMobile ? 4 : 8).map(ch => (
                <Link key={ch.id} href={`/influencer/${ch.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: isMobile ? 12 : 16, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
                    <img src={ch.thumbnail} alt={ch.title} style={{ width: isMobile ? 52 : 60, height: isMobile ? 52 : 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                    <div style={{ minWidth: 0, width: '100%' }}>
                      <p style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{ch.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                        <Users size={9} />{ch.subscriberCount}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={10} fill="#FFB800" color="#FFB800" />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{ch.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 인기 광고 영상 */}
        <section style={{ marginBottom: isMobile ? 40 : 56 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              🏆 인기 광고 순위
            </h2>
            <Link href="/trends" style={{ fontSize: 13, color: '#FF2D55', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>더보기 <ArrowRight size={13} /></Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...Array(5)].map((_, i) => <div key={i} style={{ height: 72, background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)' }} />)}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              {videos.slice(0, isMobile ? 5 : 8).map((v, i) => (
                <a key={v.id} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', gap: 12, padding: '12px 14px', borderBottom: i < videos.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: i < 3 ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: i < 3 ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>{i + 1}</div>
                  <img src={v.thumbnail} alt="" style={{ width: isMobile ? 64 : 80, height: isMobile ? 40 : 50, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.35, marginBottom: 3 }}>{v.title}</p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.channelTitle}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}><Play size={9} />{v.viewCount}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, rgba(255,45,85,0.08), rgba(255,107,53,0.08))', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 20, padding: isMobile ? '32px 20px' : '48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, marginBottom: 12 }}>지금 바로 시작하세요</h2>
          <p style={{ fontSize: isMobile ? 13 : 15, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
            광고주와 인플루언서를 안전하게 연결하는<br />라이크버튼과 함께 하세요
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup?type=advertiser" style={{ padding: isMobile ? '11px 20px' : '13px 28px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: isMobile ? 13 : 15 }}>광고주로 시작하기</Link>
            <Link href="/signup?type=influencer" style={{ padding: isMobile ? '11px 20px' : '13px 28px', background: 'var(--bg-card)', color: 'var(--text)', textDecoration: 'none', borderRadius: 10, fontWeight: 600, fontSize: isMobile ? 13 : 15, border: '1px solid var(--border)' }}>인플루언서로 등록하기</Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
