'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getTrendingVideos, YoutubeVideo } from '../lib/youtube';
import { INSTAGRAM_MOCK_PROFILES } from '../lib/instagram';
import { TIKTOK_MOCK_PROFILES } from '../lib/tiktok';
import Link from 'next/link';
import { Play, TrendingUp, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SEARCH_TRENDS = {
  '일간': [
    { rank: 1, keyword: '립스틱 추천', trend: 'NEW', rankChange: null },
    { rank: 2, keyword: '다이어트 식단', trend: '▲5', rankChange: 5 },
    { rank: 3, keyword: '게임 공략', trend: '▼2', rankChange: -2 },
    { rank: 4, keyword: '여행 브이로그', trend: 'NEW', rankChange: null },
    { rank: 5, keyword: '홈트레이닝', trend: '▲3', rankChange: 3 },
    { rank: 6, keyword: '먹방 유튜버', trend: 'NEW', rankChange: null },
    { rank: 7, keyword: '뷰티 유튜버', trend: '▼1', rankChange: -1 },
    { rank: 8, keyword: 'IT 리뷰', trend: '▲10', rankChange: 10 },
    { rank: 9, keyword: '패션 하울', trend: 'NEW', rankChange: null },
    { rank: 10, keyword: '육아 브이로그', trend: '▼3', rankChange: -3 },
  ],
  '주간': [
    { rank: 1, keyword: '스킨케어 루틴', trend: '▲2', rankChange: 2 },
    { rank: 2, keyword: '맛집 탐방', trend: 'NEW', rankChange: null },
    { rank: 3, keyword: '헬스 유튜버', trend: '▼1', rankChange: -1 },
    { rank: 4, keyword: '여행 vlog', trend: '▲5', rankChange: 5 },
    { rank: 5, keyword: '카페 투어', trend: 'NEW', rankChange: null },
    { rank: 6, keyword: '주식 투자', trend: '▲8', rankChange: 8 },
    { rank: 7, keyword: '독서 유튜버', trend: '▼4', rankChange: -4 },
    { rank: 8, keyword: '반려동물', trend: 'NEW', rankChange: null },
    { rank: 9, keyword: '제로웨이스트', trend: '▲6', rankChange: 6 },
    { rank: 10, keyword: '캠핑 브이로그', trend: '▼2', rankChange: -2 },
  ],
  '월간': [
    { rank: 1, keyword: '인플루언서 마케팅', trend: '▲15', rankChange: 15 },
    { rank: 2, keyword: '유튜브 광고', trend: '▲3', rankChange: 3 },
    { rank: 3, keyword: '브랜디드 콘텐츠', trend: 'NEW', rankChange: null },
    { rank: 4, keyword: 'PPL 광고', trend: '▼2', rankChange: -2 },
    { rank: 5, keyword: '인스타그램 협찬', trend: '▲7', rankChange: 7 },
    { rank: 6, keyword: '틱톡 챌린지', trend: 'NEW', rankChange: null },
    { rank: 7, keyword: '유튜버 섭외', trend: '▲4', rankChange: 4 },
    { rank: 8, keyword: '마케팅 비용', trend: '▼1', rankChange: -1 },
    { rank: 9, keyword: '릴스 광고', trend: '▲20', rankChange: 20 },
    { rank: 10, keyword: '인플루언서 협업', trend: '▼5', rankChange: -5 },
  ],
};

export default function TrendsPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<'유튜브'|'인스타그램'|'틱톡'>('유튜브');
  const [trendPeriod, setTrendPeriod] = useState<'일간'|'주간'|'월간'>('일간');
  const [risingPlatform, setRisingPlatform] = useState<'유튜브'|'인스타그램'|'틱톡'>('유튜브');
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    getTrendingVideos(10).then(v => { setVideos(v); setLoading(false); });
  }, []);

  const trendColor = (t: string) => t === 'NEW' ? '#FF2D55' : t.startsWith('▲') ? '#00C896' : t === '-' ? 'var(--text-muted)' : '#FF6B35';

  const getRisingInfluencers = () => {
    if (risingPlatform === '인스타그램') return INSTAGRAM_MOCK_PROFILES.slice(0, 10).map((p, i) => ({ id: p.id, name: p.display_name, count: p.followersFormatted, trend: i < 3 ? 'NEW' : i % 3 === 0 ? `▲${i * 2}` : `▼${i}`, href: `/influencer/instagram/${p.id}` }));
    if (risingPlatform === '틱톡') return TIKTOK_MOCK_PROFILES.slice(0, 10).map((p, i) => ({ id: p.id, name: p.display_name, count: p.followersFormatted, trend: i < 2 ? 'NEW' : i % 2 === 0 ? `▲${i * 3}` : `▼${i}`, href: `/influencer/tiktok/${p.id}` }));
    return videos.slice(0, 10).map((ch, i) => ({ id: ch.id, name: ch.channelTitle, count: ch.viewCount, trend: i < 3 ? 'NEW' : i % 3 === 0 ? `▲${i * 5}` : `▼${i * 2}`, href: `/influencer/${ch.id}` }));
  };

  const getRankVideos = () => {
    if (platform === '인스타그램') return INSTAGRAM_MOCK_PROFILES.slice(0, 8).map((p, i) => ({ id: p.id, title: `${p.display_name} - 광고 게시물`, viewCount: p.followersFormatted + ' 팔로워', channelTitle: '@' + p.username, thumbnail: p.avatar_url, trend: i < 2 ? 'NEW' : i % 3 === 0 ? `▲${i * 10}` : `▼${i}` }));
    if (platform === '틱톡') return TIKTOK_MOCK_PROFILES.slice(0, 8).map((p, i) => ({ id: p.id, title: `${p.display_name} - 틱톡 광고`, viewCount: p.followersFormatted + ' 팔로워', channelTitle: '@' + p.username, thumbnail: p.avatar_url, trend: i < 2 ? 'NEW' : i % 3 === 0 ? `▲${i * 15}` : `▼${i}` }));
    return videos.map((v, i) => ({ ...v, trend: i < 2 ? 'NEW' : i % 3 === 0 ? `▲${i * 5}` : i % 3 === 1 ? `▼${i}` : '-' }));
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '20px 16px' : '36px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, marginBottom: 6 }}>트렌드 분석</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>실시간 인플루언서 마케팅 트렌드를 확인하세요</p>
        </div>

        {/* 플랫폼 탭 */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {(['유튜브', '인스타그램', '틱톡'] as const).map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              style={{ padding: '9px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: platform === p ? 700 : 500, background: platform === p ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'transparent', color: platform === p ? 'white' : 'var(--text-muted)', transition: 'all 0.2s' }}>
              {p === '유튜브' ? '📺' : p === '인스타그램' ? '📸' : '🎵'} {p}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* 인기 광고 순위 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800 }}>🏆 인기 광고 순위</h2>
              <Link href="/search" style={{ fontSize: 12, color: '#FF2D55', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>더보기 <ArrowRight size={12} /></Link>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              {loading && platform === '유튜브' ? (
                [...Array(5)].map((_, i) => <div key={i} style={{ height: 68, borderBottom: '1px solid var(--border)' }} />)
              ) : (
                getRankVideos().map((item: any, i) => (
                  <div key={item.id || i} style={{ display: 'flex', gap: 10, padding: '11px 14px', borderBottom: i < getRankVideos().length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 28, flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: i < 3 ? '#FF2D55' : 'var(--text-muted)' }}>{i + 1}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: trendColor(item.trend) }}>{item.trend}</span>
                    </div>
                    <img src={item.thumbnail} alt="" style={{ width: isMobile ? 56 : 70, height: isMobile ? 36 : 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3, marginBottom: 2 }}>{item.title}</p>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.channelTitle}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}><Play size={8} />{item.viewCount}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 급상승 인플루언서 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800 }}>🚀 급상승 인플루언서</h2>
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
                <Link key={item.id} href={item.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: i < 9 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: i < 3 ? '#FF2D55' : 'var(--text-muted)', minWidth: 22 }}>{i + 1}</span>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {item.name[0]}
                  </div>
                  <span style={{ fontSize: 13, flex: 1, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 40 }}>{item.count}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: trendColor(item.trend), minWidth: 36, textAlign: 'right' }}>{item.trend}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 검색 트렌드 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800 }}>🔍 검색 트렌드</h2>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['일간', '주간', '월간'] as const).map(p => (
                <button key={p} onClick={() => setTrendPeriod(p)}
                  style={{ padding: '5px 12px', borderRadius: 16, border: `1px solid ${trendPeriod === p ? '#FF2D55' : 'var(--border)'}`, background: trendPeriod === p ? 'rgba(255,45,85,0.1)' : 'transparent', color: trendPeriod === p ? '#FF2D55' : 'var(--text-muted)', fontSize: 12, fontWeight: trendPeriod === p ? 700 : 400, cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
            {SEARCH_TRENDS[trendPeriod].map((item, i) => (
              <button key={i} onClick={() => router.push(`/search?q=${item.keyword}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', border: 'none', borderBottom: !isMobile ? (i < 8 ? '1px solid var(--border)' : 'none') : (i < 9 ? '1px solid var(--border)' : 'none'), borderRight: !isMobile && i % 2 === 0 ? '1px solid var(--border)' : 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: i < 3 ? '#FF2D55' : 'var(--text-muted)', minWidth: 22 }}>{item.rank}</span>
                  <TrendingUp size={13} color={i < 3 ? '#FF2D55' : 'var(--text-muted)'} />
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{item.keyword}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: trendColor(item.trend), minWidth: 40, textAlign: 'right' }}>{item.trend}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
