'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getTrendingVideos, searchChannels, YoutubeVideo, YoutubeChannel } from '../lib/youtube';
import { TrendingUp, Play, Users, ArrowUp, ArrowDown, Minus, Star } from 'lucide-react';
import Link from 'next/link';

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
      searchChannels('한국 유튜브 인기', 10),
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
              style={{ padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s', background: platform === tab ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--bg-card)', color: platform === tab ? 'white' : 'var(--text-muted)', border: platform === tab ? 'none' : '1px solid var(--border)' }}>
              {tab === '유튜브' ? '📺' : tab === '인스타그램' ? '📸' : '🎵'} {tab}
              {tab !== '유튜브' && <span style={{ marginLeft: 6, fontSize: 10, background: 'rgba(255,184,0,0.2)', color: '#FFB800', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>준비중</span>}
            </button>
          ))}
        </div>

        {platform !== '유튜브' ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '80px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{platform} 트렌드 준비중</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>곧 서비스될 예정이에요!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* 인기 광고 순위 */}
            <div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800 }}>🏆 인기 광고 순위</h2>
                  <span style={{ fontSize: 11, background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>YouTube 실시간</span>
                </div>
                {loading ? (
                  <div style={{ padding: 20 }}>
                    {[...Array(5)].map((_, i) => <div key={i} style={{ height: 64, background: 'var(--bg-card2)', borderRadius: 8, marginBottom: 8 }} />)}
                  </div>
                ) : (
                  <div>
                    {videos.slice(0, 10).map((v, i) => (
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
                    {channels.slice(0, 10).map((ch, i) => (
                      <Link key={ch.id} href={`/influencer/${ch.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', transition: 'background 0.2s' }}
                          className="hover:bg-white/5">
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: i < 3 ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: i < 3 ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>{i + 1}</div>
                          <img src={ch.thumbnail} alt={ch.title} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{ch.title}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}><Users size={9} />{ch.subscriberCount}</span>
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

              {/* 서비스 오픈 예정 안내 */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, marginTop: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>📊 검색 트렌드</h2>
                <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-card2)', borderRadius: 10 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>검색 트렌드 데이터는<br />서비스 오픈 후 제공될 예정이에요 🚧</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
