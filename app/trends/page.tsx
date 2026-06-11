'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getTrendingVideos, searchChannels, YoutubeVideo, YoutubeChannel } from '../lib/youtube';
import { TrendingUp, Play, Users, ArrowUp, ArrowDown, Minus, Star } from 'lucide-react';
import Link from 'next/link';

const SEARCH_TRENDS = [
  { rank: 1, keyword: '뷰티 추천', change: 5, type: 'up' },
  { rank: 2, keyword: '먹방', change: 0, type: 'same' },
  { rank: 3, keyword: '게임 리뷰', change: 2, type: 'up' },
  { rank: 4, keyword: '여행 브이로그', change: 1, type: 'down' },
  { rank: 5, keyword: '운동 루틴', change: 8, type: 'up' },
  { rank: 6, keyword: '요리 레시피', change: 3, type: 'down' },
  { rank: 7, keyword: '패션 하울', change: 0, type: 'same' },
  { rank: 8, keyword: 'IT 리뷰', change: 4, type: 'up' },
  { rank: 9, keyword: '육아 일상', change: 2, type: 'up' },
  { rank: 10, keyword: '인테리어', change: 1, type: 'down' },
];

const PERIOD_TABS = ['일간', '주간', '월간'];
const PLATFORM_TABS = ['유튜브', '인스타그램', '틱톡'];

export default function TrendsPage() {
  const [platform, setPlatform] = useState('유튜브');
  const [period, setPeriod] = useState('일간');
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getTrendingVideos(10),
      searchChannels('급상승 한국', 10),
    ]).then(([v, c]) => {
      setVideos(v);
      setChannels(c);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={28} color="#FF2D55" /> 트렌드 분석
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>실시간 인기 광고 순위와 급상승 인플루언서를 확인하세요</p>
        </div>

        {/* Platform tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {PLATFORM_TABS.map(tab => (
            <button key={tab} onClick={() => setPlatform(tab)}
              style={{ padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, background: platform === tab ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--bg-card)', color: platform === tab ? 'white' : 'var(--text-muted)', transition: 'all 0.2s', outline: platform === tab ? 'none' : '1px solid var(--border)' }}>
              {tab === '유튜브' ? '📺' : tab === '인스타그램' ? '📸' : '🎵'} {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: 24 }}>
          {/* 인기 광고 순위 */}
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>🏆 인기 광고 순위</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>실시간 업데이트</span>
              </div>
              {loading ? (
                <div style={{ padding: 20 }}>
                  {[...Array(5)].map((_, i) => <div key={i} style={{ height: 64, background: 'var(--bg-card2)', borderRadius: 8, marginBottom: 8 }} />)}
                </div>
              ) : (
                <div>
                  {videos.slice(0, 8).map((v, i) => (
                    <a key={v.id} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <div style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', transition: 'background 0.2s' }}
                        className="hover:bg-white/5">
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: i < 3 ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: i < 3 ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>{i + 1}</div>
                        <img src={v.thumbnail} alt="" style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4, marginBottom: 3 }}>{v.title}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.channelTitle}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}><Play size={9} />{v.viewCount}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 급상승 인플루언서 */}
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>🚀 급상승 인플루언서</h2>
                <div style={{ display: 'flex', gap: 4 }}>
                  {PERIOD_TABS.map(t => (
                    <button key={t} onClick={() => setPeriod(t)}
                      style={{ padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: period === t ? 'rgba(255,45,85,0.15)' : 'transparent', color: period === t ? '#FF2D55' : 'var(--text-muted)' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {loading ? (
                <div style={{ padding: 20 }}>
                  {[...Array(5)].map((_, i) => <div key={i} style={{ height: 64, background: 'var(--bg-card2)', borderRadius: 8, marginBottom: 8 }} />)}
                </div>
              ) : (
                <div>
                  {channels.slice(0, 8).map((ch, i) => (
                    <Link key={ch.id} href={`/influencer/${ch.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', transition: 'background 0.2s' }}
                        className="hover:bg-white/5">
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: i < 3 ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: i < 3 ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>{i + 1}</div>
                        <img src={ch.thumbnail} alt={ch.title} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{ch.title}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}><Users size={9} />{ch.subscriberCount}</span>
                            <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 2, color: '#00C896' }}><ArrowUp size={9} />{Math.floor(Math.random() * 20 + 1)}%</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                          <Star size={11} fill="#FFB800" color="#FFB800" />
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{ch.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 검색 트렌드 */}
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>🔍 검색 트렌드</h2>
              </div>
              <div>
                {SEARCH_TRENDS.map(trend => (
                  <Link key={trend.rank} href={`/search?q=${trend.keyword}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                      className="hover:bg-white/5">
                      <span style={{ fontSize: 13, fontWeight: 800, color: trend.rank <= 3 ? '#FF2D55' : 'var(--text-muted)', width: 20, flexShrink: 0 }}>{trend.rank}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{trend.keyword}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                        {trend.type === 'up' ? <ArrowUp size={12} color="#00C896" /> : trend.type === 'down' ? <ArrowDown size={12} color="#FF2D55" /> : <Minus size={12} color="var(--text-muted)" />}
                        <span style={{ fontSize: 11, color: trend.type === 'up' ? '#00C896' : trend.type === 'down' ? '#FF2D55' : 'var(--text-muted)' }}>{trend.change > 0 ? trend.change : '-'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 광고 집행 통계 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>📊 이번달 통계</h2>
              {[
                { label: '신규 광고 계약', value: '284건', change: '+12%' },
                { label: '평균 광고비', value: '380만원', change: '+5%' },
                { label: '완료 프로젝트', value: '156건', change: '+8%' },
                { label: '신규 인플루언서', value: '43명', change: '+15%' },
              ].map(stat => (
                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stat.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{stat.value}</span>
                    <span style={{ fontSize: 11, color: '#00C896', fontWeight: 600 }}>{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
