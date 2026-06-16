'use client';
import { showToast } from '../../components/Toast';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getChannelById, getChannelVideos, YoutubeChannel, YoutubeVideo } from '../../lib/youtube';
import { supabase } from '../../lib/supabase';
import { Star, Users, Play, ExternalLink, Heart, Share2, MessageSquare, CheckCircle, ArrowLeft } from 'lucide-react';

const REVIEWS = [
  { name: '마케팅팀장 김○○', company: '뷰티코리아', rating: 5, text: '기대 이상의 결과물이었습니다. 영상 퀄리티도 높고 팬들의 반응도 매우 좋았어요. 다음에도 꼭 같이 작업하고 싶습니다.', date: '2024.03.15' },
  { name: '브랜드매니저 이○○', company: '푸드스타트업', rating: 5, text: '소통이 정말 원활하고 기획안도 꼼꼼하게 작성해주셨어요. 조회수도 예상보다 높게 나왔고 만족합니다.', date: '2024.02.28' },
  { name: '대표 박○○', company: '패션브랜드X', rating: 4, text: '전문성이 느껴지는 콘텐츠였습니다. 일정이 조금 늦어졌지만 결과물 퀄리티는 훌륭했어요.', date: '2024.01.20' },
];

const SERVICES = [
  { type: '브랜디드', desc: '채널 메인 컨텐츠로 제작, 자연스러운 브랜드 노출', price: '500만원~', days: '14일' },
  { type: 'PPL', desc: '영상 내 자연스러운 제품/서비스 삽입 광고', price: '200만원~', days: '7일' },
  { type: '맞춤형', desc: '브랜드 요청에 따른 맞춤 제작', price: '협의', days: '협의' },
];

function maskName(name: string): string {
  if (!name) return '-';
  if (name.length <= 1) return name + '*';
  return name[0] + '*'.repeat(name.length - 1);
}

export default function InfluencerDetail() {
  const { id } = useParams<{ id: string }>();
  const [channel, setChannel] = useState<YoutubeChannel | null>(null);
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [tab, setTab] = useState<'videos' | 'audience' | 'service_desc' | 'pricing' | 'process' | 'reviews'>('videos');
  const [audiencePeriod, setAudiencePeriod] = useState<'1주일' | '1개월' | '3개월' | '1년'>('1개월');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!id) return;
    Promise.all([getChannelById(id), getChannelVideos(id, 6)]).then(([ch, vids]) => {
      setChannel(ch);
      setVideos(vids);
      setLoading(false);
    });
    // 찜 여부 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      supabase.from('favorites').select('id').eq('advertiser_id', session.user.id).eq('influencer_channel_id', id).single()
        .then(({ data }) => { if (data) setLiked(true); });
    });
  }, [id]);

  if (loading) return (
    <div>
      <Header />
      <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 16px' }}>
        <div style={{ height: 200, background: 'var(--bg-card)', borderRadius: 16, marginBottom: 20, border: '1px solid var(--border)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth < 768 ? '1fr' : '1fr 320px', gap: 24 }}>
          <div style={{ height: 400, background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }} />
          <div style={{ height: 400, background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }} />
        </div>
      </div>
    </div>
  );

  if (!channel) return (
    <div><Header />
      <div style={{ textAlign: 'center', padding: '100px 24px', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: 18 }}>채널을 찾을 수 없습니다.</p>
        <Link href="/search" style={{ color: '#FF2D55', textDecoration: 'none' }}>검색으로 돌아가기</Link>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Back */}
        <Link href="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 24, fontWeight: 500 }}
          className="hover:text-white">
          <ArrowLeft size={16} /> 검색 결과로 돌아가기
        </Link>

        {/* Profile card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img src={channel.thumbnail} alt={channel.title} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border)' }} />
              <div style={{ position: 'absolute', bottom: 4, right: 4, background: '#FF2D55', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>
                YT
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>{channel.title}</h1>
                <CheckCircle size={20} color="#FF2D55" fill="rgba(255,45,85,0.2)" />
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                {[
                  { label: '구독자', value: channel.subscriberCount },
                  { label: '총 조회수', value: channel.viewCount },
                  { label: '영상 수', value: `${channel.videoCount}개` },
                ].map(s => (
                  <div key={s.label}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>{s.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{s.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, maxWidth: 500 }}>{channel.description?.slice(0, 150) || '채널 설명이 없습니다.'}{channel.description && channel.description.length > 150 ? '...' : ''}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => setLiked(!liked)} style={{ padding: '10px 16px', background: liked ? 'rgba(255,45,85,0.15)' : 'var(--bg-card2)', border: `1px solid ${liked ? '#FF2D55' : 'var(--border)'}`, color: liked ? '#FF2D55' : 'var(--text-muted)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
                <Heart size={16} fill={liked ? '#FF2D55' : 'none'} /> {liked ? '관심 등록됨' : '관심 등록'}
              </button>
              <button style={{ padding: '10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, cursor: 'pointer' }}>
                <Share2 size={16} />
              </button>
              <a href={`https://youtube.com/channel/${id}`} target="_blank" rel="noreferrer" style={{ padding: '10px 16px', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#FF4444', borderRadius: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                <ExternalLink size={14} /> YouTube
              </a>
            </div>
          </div>

          {/* Rating */}
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={18} fill={s <= Math.round(channel.rating as number) ? '#FFB800' : 'none'} color="#FFB800" />)}
              </div>
              <span style={{ fontSize: 22, fontWeight: 900 }}>{channel.rating}</span>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>({channel.reviewCount}개 리뷰)</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['소통 좋음', '고품질 콘텐츠', '일정 준수'].map(tag => (
                <span key={tag} style={{ padding: '3px 10px', background: 'rgba(0,200,150,0.1)', color: '#00C896', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: 20, alignItems: 'start' }}>
          {/* Left: tabs */}
          <div>
            {/* Tab nav */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, overflowX: isMobile ? 'auto' : 'visible', WebkitOverflowScrolling: 'touch' }}>
              {[['videos', '최근 영상'], ['audience', '시청자층 분석'], ['service_desc', '서비스 설명'], ['pricing', '가격 정보'], ['process', '과정 소개'], ['reviews', '리뷰']].map(([val, label]) => (
                <button key={val} onClick={() => setTab(val as any)}
                  style={{ flex: isMobile ? '0 0 auto' : 1, padding: isMobile ? '7px 12px' : '7px 4px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: tab === val ? 700 : 500, background: tab === val ? 'var(--bg-card2)' : 'transparent', color: tab === val ? 'var(--text)' : 'var(--text-muted)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  {label}
                </button>
              ))}
            </div>

            {tab === 'videos' && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: isMobile ? 10 : 14 }}>
                {videos.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, gridColumn: '1/-1' }}>영상을 불러오는 중...</p>
                ) : videos.map(v => (
                  <a key={v.id} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ overflow: 'hidden' }}>
                      <div style={{ position: 'relative' }}>
                        <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: 4, padding: '2px 6px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Play size={9} fill="white" /> {v.viewCount}
                        </div>
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <p style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4, color: 'var(--text)' }}>{v.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{v.publishedAt}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {tab === 'audience' && (
              <div>
                {/* Period selector */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                  {(['1주일', '1개월', '3개월', '1년'] as const).map(p => (
                    <button key={p} onClick={() => setAudiencePeriod(p)}
                      style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${audiencePeriod === p ? '#FF2D55' : 'var(--border)'}`, background: audiencePeriod === p ? 'rgba(255,45,85,0.1)' : 'transparent', color: audiencePeriod === p ? '#FF2D55' : 'var(--text-muted)', fontSize: 13, fontWeight: audiencePeriod === p ? 700 : 400, cursor: 'pointer' }}>
                      {p}
                    </button>
                  ))}
                </div>

                {/* 조회수 증가율 */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    📈 조회수 증가율
                    <span style={{ fontSize: 11, background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>+12.4%</span>
                  </h3>
                  {/* SVG Chart */}
                  <svg viewBox="0 0 600 160" style={{ width: '100%', height: 160 }}>
                    <defs>
                      <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF2D55" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#FF2D55" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[0,1,2,3].map(i => (
                      <line key={i} x1="40" y1={20 + i * 35} x2="590" y2={20 + i * 35} stroke="var(--border)" strokeWidth="1" />
                    ))}
                    {/* Y labels */}
                    {['100만', '75만', '50만', '25만'].map((l, i) => (
                      <text key={l} x="35" y={24 + i * 35} textAnchor="end" fontSize="10" fill="var(--text-muted)">{l}</text>
                    ))}
                    {/* Area */}
                    <path d="M60,110 L130,95 L200,80 L270,70 L340,85 L410,60 L480,45 L550,30" fill="url(#viewGrad)" stroke="none" />
                    <path d="M60,110 L130,95 L200,80 L270,70 L340,85 L410,60 L480,45 L550,30 L550,130 L60,130 Z" fill="url(#viewGrad)" />
                    {/* Line */}
                    <polyline points="60,110 130,95 200,80 270,70 340,85 410,60 480,45 550,30" fill="none" stroke="#FF2D55" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Dots */}
                    {[[60,110],[130,95],[200,80],[270,70],[340,85],[410,60],[480,45],[550,30]].map(([x,y], i) => (
                      <circle key={i} cx={x} cy={y} r="4" fill="#FF2D55" stroke="var(--bg-card)" strokeWidth="2" />
                    ))}
                    {/* X labels */}
                    {(audiencePeriod === '1주일' ? ['월','화','수','목','금','토','일'] : audiencePeriod === '1개월' ? ['1주','2주','3주','4주'] : audiencePeriod === '3개월' ? ['1월','2월','3월'] : ['1Q','2Q','3Q','4Q']).map((l, i, arr) => (
                      <text key={l} x={60 + i * (490 / Math.max(arr.length - 1, 1))} y="150" textAnchor="middle" fontSize="10" fill="var(--text-muted)">{l}</text>
                    ))}
                  </svg>
                </div>

                {/* 구독자 증가율 */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    👥 구독자 증가율
                    <span style={{ fontSize: 11, background: 'rgba(255,107,53,0.1)', color: '#FF6B35', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>+8.2%</span>
                  </h3>
                  <svg viewBox="0 0 600 160" style={{ width: '100%', height: 160 }}>
                    <defs>
                      <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[0,1,2,3].map(i => (
                      <line key={i} x1="40" y1={20 + i * 35} x2="590" y2={20 + i * 35} stroke="var(--border)" strokeWidth="1" />
                    ))}
                    {['50만','40만','30만','20만'].map((l, i) => (
                      <text key={l} x="35" y={24 + i * 35} textAnchor="end" fontSize="10" fill="var(--text-muted)">{l}</text>
                    ))}
                    <path d="M60,120 L130,108 L200,100 L270,88 L340,80 L410,68 L480,55 L550,40 L550,130 L60,130 Z" fill="url(#subGrad)" />
                    <polyline points="60,120 130,108 200,100 270,88 340,80 410,68 480,55 550,40" fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {[[60,120],[130,108],[200,100],[270,88],[340,80],[410,68],[480,55],[550,40]].map(([x,y], i) => (
                      <circle key={i} cx={x} cy={y} r="4" fill="#FF6B35" stroke="var(--bg-card)" strokeWidth="2" />
                    ))}
                    {(audiencePeriod === '1주일' ? ['월','화','수','목','금','토','일'] : audiencePeriod === '1개월' ? ['1주','2주','3주','4주'] : audiencePeriod === '3개월' ? ['1월','2월','3월'] : ['1Q','2Q','3Q','4Q']).map((l, i, arr) => (
                      <text key={l} x={60 + i * (490 / Math.max(arr.length - 1, 1))} y="150" textAnchor="middle" fontSize="10" fill="var(--text-muted)">{l}</text>
                    ))}
                  </svg>
                </div>

                {/* 시청자 분포 */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                  {/* 연령대 */}
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>👤 시청자 연령대</h3>
                    {[['13~17세', 8], ['18~24세', 32], ['25~34세', 35], ['35~44세', 18], ['45세+', 7]].map(([age, pct]) => (
                      <div key={age} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{age}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#FF2D55' }}>{pct}%</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #FF2D55, #FF6B35)', borderRadius: 3 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* 성별 */}
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>⚧ 시청자 성별</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 16, paddingTop: 10 }}>
                      {[['여성', 58, '#FF2D55'], ['남성', 42, '#5B8DEF']].map(([label, pct, color]) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `conic-gradient(${color} 0% ${pct}%, var(--border) ${pct}% 100%)`, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: 13, fontWeight: 900, color: color as string }}>{pct}%</span>
                            </div>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>* 예상 데이터 기준</p>
                  </div>
                </div>

                {/* 시청자 지역 */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginTop: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>시청자 지역</h3>
                  {[
                    { country: '🇰🇷 대한민국', pct: 82.4 },
                    { country: '🇺🇸 미국', pct: 5.1 },
                    { country: '🇯🇵 일본', pct: 3.8 },
                    { country: '🇨🇳 중국', pct: 2.5 },
                    { country: '🌏 기타', pct: 6.2 },
                  ].map(item => (
                    <div key={item.country} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 13, minWidth: 120 }}>{item.country}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3 }}>
                          <div style={{ width: `${item.pct}%`, height: '100%', background: 'linear-gradient(90deg,#FF2D55,#FF6B35)', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#FF2D55', minWidth: 44, textAlign: 'right' }}>{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 서비스 설명 탭 */}
            {tab === 'service_desc' && (
              <div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>서비스 설명</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>
                    안녕하세요! 유튜브 크리에이터입니다.<br/><br/>
                    브랜디드 콘텐츠, PPL, 맞춤형 광고 모두 진행 가능합니다.<br/>
                    구독자분들과의 높은 신뢰를 바탕으로 자연스럽게 제품을 소개하는 방식으로 진행합니다.<br/><br/>
                    광고 진행 전 충분한 미팅을 통해 브랜드의 메시지를 정확히 파악하고, 채널 특성에 맞는 최적의 콘텐츠를 제작해드립니다.
                  </p>
                </div>
                {/* 인기 영상 */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>인기 영상</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 10 }}>
                    {videos.slice(0, 3).map(v => (
                      <a key={v.id} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'var(--bg-card2)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <img src={v.thumbnail} alt={v.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                          <div style={{ padding: '8px 10px' }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4, marginBottom: 4 }}>{v.title}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>조회수 {v.viewCount}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 광고 영상 영역 */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>광고 영상</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 10 }}>
                    {videos.slice(0, 3).map((v, i) => (
                      <a key={i} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'var(--bg-card2)', borderRadius: 10, overflow: 'hidden', border: '2px solid rgba(255,45,85,0.2)', position: 'relative' }}>
                          <img src={v.thumbnail} alt={v.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(255,45,85,0.9)', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>AD</div>
                          <div style={{ padding: '8px 10px' }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>{v.title}</p>
                            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>조회수 {v.viewCount}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 가격 정보 탭 */}
            {tab === 'pricing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {SERVICES.map(s => (
                  <div key={s.type} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div>
                        <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{s.type}</h3>
                        <p style={{ fontSize: 20, fontWeight: 900, color: '#FF2D55' }}>{s.price}</p>
                      </div>
                      <span style={{ fontSize: 12, background: 'rgba(255,45,85,0.08)', color: '#FF2D55', padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>작업 {s.days}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 14 }}>
                      <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '12px' }}>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>설명</p>
                        <p style={{ fontSize: 13, lineHeight: 1.5 }}>{s.desc}</p>
                      </div>
                      <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '12px' }}>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>예상 성과</p>
                        <p style={{ fontSize: 13, lineHeight: 1.5 }}>조회수 10만+ 기대, 브랜드 노출 극대화, 전환율 향상</p>
                      </div>
                    </div>
                    <Link href={`/request/${channel?.id}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700 }}>
                      {s.type} 광고 요청하기
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* 과정 소개 탭 */}
            {tab === 'process' && (
              <div>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>광고 진행 과정</h3>
                  {[
                    { step: 1, title: '광고 요청', desc: '광고주가 광고 요청서를 작성하여 인플루언서에게 전달합니다.', icon: '📝', time: '1일' },
                    { step: 2, title: '계약 및 입금', desc: '양측 계약서 작성 후 광고비를 안전결제로 입금합니다.', icon: '✍️', time: '1~2일' },
                    { step: 3, title: '광고 기획안 작성', desc: '인플루언서가 기획안을 작성하고 광고주 확인 후 확정합니다.', icon: '📋', time: '3~5일' },
                    { step: 4, title: '영상 촬영 및 편집', desc: '확정된 기획안을 바탕으로 영상을 촬영하고 편집합니다.', icon: '🎬', time: '7~14일' },
                    { step: 5, title: '영상 피드백', desc: '편집 영상을 광고주에게 공유하고 피드백을 반영합니다.', icon: '🔍', time: '2~3일' },
                    { step: 6, title: '광고 게시', desc: '최종 확정된 영상을 채널에 업로드하고 광고를 진행합니다.', icon: '📢', time: '1일' },
                    { step: 7, title: '광고 완료', desc: '광고 진행 확정 후 정산이 완료됩니다.', icon: '✅', time: '정산 후 3일' },
                  ].map((item, i) => (
                    <div key={item.step} style={{ display: 'flex', gap: 14, marginBottom: i < 6 ? 20 : 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                        {i < 6 && <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 4, minHeight: 24 }} />}
                      </div>
                      <div style={{ paddingBottom: i < 6 ? 8 : 0 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                          <p style={{ fontSize: 14, fontWeight: 700 }}>STEP {item.step}. {item.title}</p>
                          <span style={{ fontSize: 11, background: 'var(--bg-card2)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 20 }}>{item.time}</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 리뷰 탭 */}
            {tab === 'reviews' && (
              <div>
                {/* 평점 요약 */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 48, fontWeight: 900, color: '#FFB800', lineHeight: 1 }}>{channel?.rating}</p>
                    <div style={{ display: 'flex', gap: 2, justifyContent: 'center', margin: '6px 0' }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= Math.floor(parseFloat(String(channel?.rating || '0'))) ? '#FFB800' : 'none'} color="#FFB800" />)}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{channel?.reviewCount}개 리뷰</p>
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    {[[5,75],[4,18],[3,5],[2,1],[1,1]].map(([star, pct]) => (
                      <div key={star} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 16 }}>{star}</span>
                        <Star size={11} fill="#FFB800" color="#FFB800" />
                        <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#FFB800', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 28 }}>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 리뷰 목록 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {REVIEWS.map((r, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {r.name[0]}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 14 }}>{maskName(r.name)}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.company}</p>
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end', marginBottom: 2 }}>
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? '#FFB800' : 'none'} color="#FFB800" />)}
                          </div>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>{r.date}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{r.text}</p>
                      {/* 인플루언서 답글 */}
                      {i === 0 && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                          <img src={channel?.thumbnail} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                          <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '10px 14px', flex: 1 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{channel?.title} <span style={{ fontSize: 11, color: '#FF2D55', fontWeight: 600 }}>인플루언서</span></p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>감사합니다! 함께 진행하게 되어 영광이었습니다. 다음에도 꼭 함께 해요 😊</p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>1시간 전</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: CTA */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 88 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 14 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>최소 광고 비용</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#FF2D55', marginBottom: 4 }}>{channel.estimatedPrice}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>실제 비용은 광고 형태에 따라 달라집니다</p>
              <Link href={`/request/${id}`} style={{ display: 'block', width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, textAlign: 'center', marginBottom: 10 }}>
                광고 요청하기
              </Link>
              <button style={{ width: '100%', padding: '12px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <MessageSquare size={15} /> 메시지 보내기
              </button>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>채널 정보</p>
              {[
                { label: '플랫폼', value: '유튜브' },
                { label: '구독자', value: channel.subscriberCount },
                { label: '총 영상', value: `${channel.videoCount}개` },
                { label: '총 조회수', value: channel.viewCount },
                { label: '국가', value: channel.country || 'KR' },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{info.label}</span>
                  <span style={{ fontWeight: 600 }}>{info.value}</span>
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
