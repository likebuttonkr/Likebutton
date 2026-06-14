'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import { getTrendingVideos, searchChannels, YoutubeVideo, YoutubeChannel } from './lib/youtube';
import { INSTAGRAM_MOCK_PROFILES } from './lib/instagram';
import { TIKTOK_MOCK_PROFILES } from './lib/tiktok';
import { Search, TrendingUp, Play, Users, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BANNERS = [
  { title: '안전결제로\n믿을 수 있는 거래', sub: '계약서 작성부터 정산까지\n플랫폼이 안전하게 보장합니다.', emoji: '🔒', bg: 'linear-gradient(135deg,#FF2D55,#FF6B35)' },
  { title: '5만+ 인플루언서와\n함께하세요', sub: '유튜브, 인스타그램, 틱톡\n최적의 크리에이터를 찾아드립니다.', emoji: '🎬', bg: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)' },
  { title: '데이터 기반\n정확한 매칭', sub: '구독자 연령, 성별, 조회수 분석으로\n딱 맞는 인플루언서를 추천합니다.', emoji: '📊', bg: 'linear-gradient(135deg,#00C896,#5B8DEF)' },
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

const SEARCH_TRENDS = {
  '일간': [
    { rank: 1, keyword: '립스틱 추천', trend: 'NEW' },
    { rank: 2, keyword: '다이어트 식단', trend: '▲5' },
    { rank: 3, keyword: '게임 공략', trend: '▼2' },
    { rank: 4, keyword: '여행 브이로그', trend: 'NEW' },
    { rank: 5, keyword: '홈트레이닝', trend: '▲3' },
    { rank: 6, keyword: '먹방 유튜버', trend: 'NEW' },
    { rank: 7, keyword: '뷰티 유튜버', trend: '▼1' },
    { rank: 8, keyword: 'IT 리뷰', trend: '▲10' },
    { rank: 9, keyword: '패션 하울', trend: 'NEW' },
    { rank: 10, keyword: '육아 브이로그', trend: '▼3' },
  ],
  '주간': [
    { rank: 1, keyword: '스킨케어 루틴', trend: '▲2' },
    { rank: 2, keyword: '맛집 탐방', trend: 'NEW' },
    { rank: 3, keyword: '헬스 유튜버', trend: '▼1' },
    { rank: 4, keyword: '여행 vlog', trend: '▲5' },
    { rank: 5, keyword: '카페 투어', trend: 'NEW' },
    { rank: 6, keyword: '주식 투자', trend: '▲8' },
    { rank: 7, keyword: '독서 유튜버', trend: '▼4' },
    { rank: 8, keyword: '반려동물', trend: 'NEW' },
    { rank: 9, keyword: '제로웨이스트', trend: '▲6' },
    { rank: 10, keyword: '캠핑 브이로그', trend: '▼2' },
  ],
  '월간': [
    { rank: 1, keyword: '인플루언서 마케팅', trend: '▲15' },
    { rank: 2, keyword: '유튜브 광고', trend: '▲3' },
    { rank: 3, keyword: '브랜디드 콘텐츠', trend: 'NEW' },
    { rank: 4, keyword: 'PPL 광고', trend: '▼2' },
    { rank: 5, keyword: '인스타그램 협찬', trend: '▲7' },
    { rank: 6, keyword: '틱톡 챌린지', trend: 'NEW' },
    { rank: 7, keyword: '유튜버 섭외', trend: '▲4' },
    { rank: 8, keyword: '마케팅 비용', trend: '▼1' },
    { rank: 9, keyword: '릴스 광고', trend: '▲20' },
    { rank: 10, keyword: '인플루언서 협업', trend: '▼5' },
  ],
};

export default function MainPage() {
  const router = useRouter();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [bannerHover, setBannerHover] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [rankPlatform, setRankPlatform] = useState<'유튜브'|'인스타그램'|'틱톡'>('유튜브');
  const [trendPeriod, setTrendPeriod] = useState<'일간'|'주간'|'월간'>('일간');
  const [risingPlatform, setRisingPlatform] = useState<'유튜브'|'인스타그램'|'틱톡'>('유튜브');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([getTrendingVideos(10), searchChannels('한국 인기 유튜브', 10)])
      .then(([v, c]) => { setVideos(v); setChannels(c); setLoading(false); });
  }, []);

  const banner = BANNERS[bannerIdx];

  const getRisingInfluencers = () => {
    if (risingPlatform === '인스타그램') return INSTAGRAM_MOCK_PROFILES.slice(0, 10).map((p, i) => ({ name: p.display_name, count: p.followersFormatted, trend: i < 3 ? 'NEW' : i % 3 === 0 ? `▲${i * 2}` : `▼${i}` }));
    if (risingPlatform === '틱톡') return TIKTOK_MOCK_PROFILES.slice(0, 10).map((p, i) => ({ name: p.display_name, count: p.followersFormatted, trend: i < 2 ? 'NEW' : i % 2 === 0 ? `▲${i * 3}` : `▼${i}` }));
    return channels.slice(0, 10).map((ch, i) => ({ name: ch.title, count: ch.subscriberCount, trend: i < 3 ? 'NEW' : i % 3 === 0 ? `▲${i * 5}` : `▼${i * 2}` }));
  };

  const getRankingVideos = () => {
    if (rankPlatform === '인스타그램') return INSTAGRAM_MOCK_PROFILES.slice(0, 5).map((p, i) => ({ title: `${p.display_name} - 인스타그램 게시물`, viewCount: p.followersFormatted + ' 팔로워', channelTitle: p.username, id: p.id, thumbnail: p.avatar_url, rank: i + 1, trend: i === 0 ? 'NEW' : i % 2 === 0 ? `▲${i * 10}` : `▼${i}` }));
    if (rankPlatform === '틱톡') return TIKTOK_MOCK_PROFILES.slice(0, 5).map((p, i) => ({ title: `${p.display_name} - 틱톡 영상`, viewCount: p.followersFormatted + ' 팔로워', channelTitle: p.username, id: p.id, thumbnail: p.avatar_url, rank: i + 1, trend: i === 0 ? 'NEW' : i % 2 === 0 ? `▲${i * 15}` : `▼${i}` }));
    return videos.slice(0, 8).map((v, i) => ({ ...v, rank: i + 1, trend: i === 0 ? 'NEW' : i % 3 === 0 ? `▲${i * 5}` : i % 3 === 1 ? `▼${i}` : '-' }));
  };

  const trendColor = (t: string) => t === 'NEW' ? '#FF2D55' : t.startsWith('▲') ? '#00C896' : t === '-' ? 'var(--text-muted)' : '#FF6B35';

  return (
    <div>
      <Header />

      {/* Hero Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a14 100%)', padding: isMobile ? '36px 16px' : '60px 24px', overflow: 'hidden', position: 'relative' }}
        onMouseEnter={() => setBannerHover(true)} onMouseLeave={() => setBannerHover(false)}>
        {/* 좌우 화살표 */}
        {bannerHover && !isMobile && (
          <>
            <button onClick={() => setBannerIdx(i => (i - 1 + BANNERS.length) % BANNERS.length)}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, backdropFilter: 'blur(8px)' }}>
              ‹
            </button>
            <button onClick={() => setBannerIdx(i => (i + 1) % BANNERS.length)}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, backdropFilter: 'blur(8px)' }}>
              ›
            </button>
          </>
        )}
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: isMobile ? 28 : 48, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,45,85,0.15)', border: '1px solid rgba(255,45,85,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#FF2D55', marginBottom: 20 }}>
              ⚡ 인플루언서 마케팅 플랫폼 No.1
            </span>
            <h1 style={{ fontSize: isMobile ? 30 : 46, fontWeight: 900, lineHeight: 1.2, marginBottom: 16, whiteSpace: 'pre-line' }}>{banner.title}</h1>
            <p style={{ fontSize: isMobile ? 14 : 16, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28, whiteSpace: 'pre-line' }}>{banner.sub}</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              <Link href="/about" style={{ padding: isMobile ? '11px 20px' : '13px 28px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: isMobile ? 13 : 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                더 알아보기 <ArrowRight size={15} />
              </Link>
              <Link href="/signup" style={{ padding: isMobile ? '11px 20px' : '13px 28px', background: 'rgba(255,255,255,0.08)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 600, fontSize: isMobile ? 13 : 15, border: '1px solid rgba(255,255,255,0.15)' }}>
                무료로 시작하기
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {BANNERS.map((_, i) => (
                <button key={i} onClick={() => setBannerIdx(i)}
                  style={{ width: i === bannerIdx ? 24 : 8, height: 8, borderRadius: 4, background: i === bannerIdx ? '#FF2D55' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
              ))}
            </div>
          </div>

          {/* 검색 박스 */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: isMobile ? 18 : 24, backdropFilter: 'blur(10px)' }}>
            <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>빠른 인플루언서 검색</p>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && router.push(`/search?q=${searchVal}`)}
                placeholder="채널명, 카테고리 검색..." style={{ paddingLeft: 34, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {CATEGORIES.slice(0, 6).map(cat => (
                <button key={cat.label} onClick={() => router.push(`/search?q=${cat.query}`)}
                  style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer' }}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {[['📺 유튜브', '유튜브'], ['📸 인스타', '인스타그램'], ['🎵 틱톡', '틱톡']].map(([label, platform]) => (
                <button key={platform} onClick={() => router.push(`/search?platform=${platform}`)}
                  style={{ flex: 1, padding: '8px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => router.push(`/search?q=${searchVal}`)}
              style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              검색하기
            </button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '28px 16px' : '44px 24px' }}>

        {/* 카테고리 */}
        <section style={{ marginBottom: isMobile ? 36 : 52 }}>
          <h2 style={{ fontSize: isMobile ? 17 : 21, fontWeight: 800, marginBottom: 14 }}>카테고리</h2>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 4 : 8}, 1fr)`, gap: isMobile ? 8 : 12 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.label} href={`/search?q=${cat.query}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: isMobile ? '12px 4px' : '16px 8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <span style={{ fontSize: isMobile ? 22 : 26 }}>{cat.icon}</span>
                <span style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: 'var(--text-muted)' }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 인기 광고 순위 */}
        <section style={{ marginBottom: isMobile ? 36 : 52 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: isMobile ? 17 : 21, fontWeight: 800 }}>🏆 인기 광고 순위</h2>
            <Link href="/trends" style={{ fontSize: 13, color: '#FF2D55', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>더보기 <ArrowRight size={13} /></Link>
          </div>
          {/* 플랫폼 탭 */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {(['유튜브', '인스타그램', '틱톡'] as const).map(p => (
              <button key={p} onClick={() => setRankPlatform(p)}
                style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${rankPlatform === p ? '#FF2D55' : 'var(--border)'}`, background: rankPlatform === p ? 'rgba(255,45,85,0.1)' : 'transparent', color: rankPlatform === p ? '#FF2D55' : 'var(--text-muted)', fontSize: 13, fontWeight: rankPlatform === p ? 700 : 400, cursor: 'pointer' }}>
                {p === '유튜브' ? '📺' : p === '인스타그램' ? '📸' : '🎵'} {p}
              </button>
            ))}
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            {loading && rankPlatform === '유튜브' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[...Array(5)].map((_, i) => <div key={i} style={{ height: 68, borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-card2)' }} />)}
              </div>
            ) : (
              getRankingVideos().map((item: any, i) => (
                <div key={item.id || i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: i < getRankingVideos().length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 32, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: i < 3 ? '#FF2D55' : 'var(--text-muted)' }}>{i + 1}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: trendColor(item.trend || '-') }}>{item.trend || '-'}</span>
                  </div>
                  <img src={item.thumbnail} alt="" style={{ width: isMobile ? 60 : 80, height: isMobile ? 38 : 50, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.35, marginBottom: 3 }}>{item.title}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.channelTitle || item.username}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}><Play size={9} />{item.viewCount}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 2열 레이아웃: 검색 트렌드 + 급상승 인플루언서 */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, marginBottom: isMobile ? 36 : 52 }}>
          {/* 서비스 소개 */}
        <section style={{ marginBottom: isMobile ? 36 : 52 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, marginBottom: 8 }}>라이크버튼이 특별한 이유</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>광고주와 인플루언서를 안전하고 효율적으로 연결합니다</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16 }}>
            {[
              { icon: '🔍', title: '정확한 매칭', desc: '구독자 수, 연령, 성별, 카테고리 등 다양한 필터로 내 브랜드에 딱 맞는 인플루언서를 찾아드려요.' },
              { icon: '🔒', title: '안전한 거래', desc: '안전결제 시스템으로 광고 완료 전까지 금액을 보호하고, 모든 거래 과정을 투명하게 관리합니다.' },
              { icon: '📊', title: '데이터 기반', desc: '실시간 조회수, 구독자 증가율, 시청자층 분석 등 빅데이터로 최적의 광고 효과를 예측합니다.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 검색 트렌드 */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: isMobile ? 17 : 21, fontWeight: 800 }}>🔍 검색 트렌드</h2>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['일간', '주간', '월간'] as const).map(p => (
                  <button key={p} onClick={() => setTrendPeriod(p)}
                    style={{ padding: '4px 10px', borderRadius: 16, border: `1px solid ${trendPeriod === p ? '#FF2D55' : 'var(--border)'}`, background: trendPeriod === p ? 'rgba(255,45,85,0.1)' : 'transparent', color: trendPeriod === p ? '#FF2D55' : 'var(--text-muted)', fontSize: 12, fontWeight: trendPeriod === p ? 700 : 400, cursor: 'pointer' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              {SEARCH_TRENDS[trendPeriod].map((item, i) => (
                <button key={i} onClick={() => router.push(`/search?q=${item.keyword}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 16px', border: 'none', borderBottom: i < 9 ? '1px solid var(--border)' : 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: i < 3 ? '#FF2D55' : 'var(--text-muted)', minWidth: 22 }}>{item.rank}</span>
                  <span style={{ fontSize: 13, flex: 1, color: 'var(--text)', fontWeight: 500 }}>{item.keyword}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: trendColor(item.trend), minWidth: 40, textAlign: 'right' }}>{item.trend}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 급상승 인플루언서 */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: isMobile ? 17 : 21, fontWeight: 800 }}>🚀 급상승 인플루언서</h2>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['유튜브', '인스타그램', '틱톡'] as const).map(p => (
                  <button key={p} onClick={() => setRisingPlatform(p)}
                    style={{ padding: '4px 8px', borderRadius: 16, border: `1px solid ${risingPlatform === p ? '#FF2D55' : 'var(--border)'}`, background: risingPlatform === p ? 'rgba(255,45,85,0.1)' : 'transparent', color: risingPlatform === p ? '#FF2D55' : 'var(--text-muted)', fontSize: 11, fontWeight: risingPlatform === p ? 700 : 400, cursor: 'pointer' }}>
                    {p === '유튜브' ? '📺' : p === '인스타그램' ? '📸' : '🎵'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              {getRisingInfluencers().map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: i < 9 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: i < 3 ? '#FF2D55' : 'var(--text-muted)', minWidth: 22 }}>{i + 1}</span>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {item.name[0]}
                  </div>
                  <span style={{ fontSize: 13, flex: 1, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 40 }}>{item.count}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: trendColor(item.trend), minWidth: 36, textAlign: 'right' }}>{item.trend}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 급상승 채널 */}
        <section style={{ marginBottom: isMobile ? 36 : 52 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: isMobile ? 17 : 21, fontWeight: 800 }}>✨ 주요 고객사</h2>
            <Link href="/search" style={{ fontSize: 13, color: '#FF2D55', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>더보기 <ArrowRight size={13} /></Link>
          </div>
          {/* 로고 영역 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, justifyContent: 'center' }}>
            {['삼성', 'LG', '현대', 'SK', '롯데', 'CJ', '아모레', '올리브영', '마켓컬리', '쿠팡'].map(logo => (
              <div key={logo} style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{logo}</div>
            ))}
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: 12 }}>
              {[...Array(4)].map((_, i) => <div key={i} style={{ height: 130, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)' }} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: 12 }}>
              {channels.slice(0, isMobile ? 4 : 8).map(ch => (
                <Link key={ch.id} href={`/influencer/${ch.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: isMobile ? 12 : 16, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
                    <img src={ch.thumbnail} alt={ch.title} style={{ width: isMobile ? 50 : 60, height: isMobile ? 50 : 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                    <div style={{ minWidth: 0, width: '100%' }}>
                      <p style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)', marginBottom: 2 }}>{ch.title}</p>
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

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg,rgba(255,45,85,0.08),rgba(255,107,53,0.08))', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 20, padding: isMobile ? '28px 20px' : '44px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, marginBottom: 10 }}>지금 바로 시작하세요</h2>
          <p style={{ fontSize: isMobile ? 13 : 15, color: 'var(--text-muted)', marginBottom: 22, lineHeight: 1.6 }}>
            광고주와 인플루언서를 안전하게 연결하는 라이크버튼과 함께하세요
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup?type=advertiser" style={{ padding: isMobile ? '11px 20px' : '13px 28px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: isMobile ? 13 : 15 }}>광고주로 시작하기</Link>
            <Link href="/signup?type=influencer" style={{ padding: isMobile ? '11px 20px' : '13px 28px', background: 'var(--bg-card)', color: 'var(--text)', textDecoration: 'none', borderRadius: 10, fontWeight: 600, fontSize: isMobile ? 13 : 15, border: '1px solid var(--border)' }}>인플루언서로 등록하기</Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
