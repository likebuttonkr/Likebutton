'use client';
import { showToast } from '../../../components/Toast';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { ArrowLeft, MessageSquare, Star, Play } from 'lucide-react';
import { TIKTOK_MOCK_PROFILES } from '../../../lib/tiktok';
import { supabase } from '../../../lib/supabase';

const TT_SERVICES = [
  { type: '틱톡 영상', price: '1,000,000원~', desc: '틱톡 숏폼 광고 영상 제작 및 게시', days: '7일' },
  { type: '챌린지 영상', price: '2,000,000원~', desc: '브랜드 챌린지 참여 영상', days: '10일' },
  { type: '맞춤형', price: '협의', desc: '브랜드 특성에 맞는 맞춤 광고', days: '협의' },
];

const MOCK_VIDEOS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  thumb: `https://picsum.photos/200/350?random=${i + 20}`,
  views: `${Math.floor(Math.random() * 900 + 100)}K`,
  likes: `${Math.floor(Math.random() * 50 + 5)}K`,
}));

export default function TikTokDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState<'videos'|'audience'|'service_desc'|'pricing'|'process'|'reviews'>('videos');
  const [liked, setLiked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const found = TIKTOK_MOCK_PROFILES.find(p => p.id === id);
    setProfile(found || TIKTOK_MOCK_PROFILES[0]);
  }, [id]);

  const handleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { showToast('로그인 후 이용해주세요.', 'info'); return; }
    if (liked) {
      await supabase.from('favorites').delete().eq('advertiser_id', session.user.id).eq('influencer_channel_id', id);
    } else {
      await supabase.from('favorites').insert({ advertiser_id: session.user.id, influencer_channel_id: id, platform: 'tiktok', channel_name: profile?.display_name, channel_thumbnail: profile?.avatar_url, subscriber_count: profile?.followersFormatted });
    }
    setLiked(!liked);
  };

  if (!profile) return null;

  const TABS = [['videos','최근 영상'], ['audience','시청자층 분석'], ['service_desc','서비스 설명'], ['pricing','가격 정보'], ['process','과정 소개'], ['reviews','리뷰']];

  return (
    <div>
      <Header isLoggedIn={true} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>
        <Link href="/search?platform=틱톡" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 20 }}>
          <ArrowLeft size={15} /> 틱톡 검색으로
        </Link>

        {/* 프로필 헤더 */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '20px' : '28px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <img src={profile.avatar_url} alt={profile.display_name} style={{ width: isMobile ? 72 : 96, height: isMobile ? 72 : 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid #000', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, background: '#000', color: 'white', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>🎵 틱톡</span>
                <span style={{ fontSize: 11, background: 'var(--bg-card2)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: 20 }}>{profile.category}</span>
              </div>
              <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 900, marginBottom: 4 }}>{profile.display_name}</h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>@{profile.username}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14 }}>{profile.bio_description}</p>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[['팔로워', profile.followersFormatted], ['좋아요', `${(profile.likes_count / 10000).toFixed(0)}만`], ['영상', `${profile.video_count}개`], ['최소광고비', profile.estimatedPrice]].map(([label, value]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 16, fontWeight: 900 }}>{value}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
              <button onClick={handleLike} style={{ padding: '10px 20px', background: liked ? 'rgba(0,0,0,0.1)' : 'var(--bg-card2)', border: `1px solid ${liked ? '#000' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', fontSize: 20 }}>
                {liked ? '❤️' : '🤍'}
              </button>
              <Link href="/messages" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                <MessageSquare size={14} /> 메시지
              </Link>
              <Link href={`/request/${id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', background: 'linear-gradient(135deg,#FF2D55,#000)', color: 'white', textDecoration: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
                광고 요청하기
              </Link>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, overflowX: 'auto' }}>
          {TABS.map(([val, label]) => (
            <button key={val} onClick={() => setTab(val as any)}
              style={{ flex: 1, padding: '7px 4px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: tab === val ? 700 : 500, background: tab === val ? 'var(--bg-card2)' : 'transparent', color: tab === val ? 'var(--text)' : 'var(--text-muted)', whiteSpace: 'nowrap', minWidth: 56 }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'videos' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 8 }}>
            {MOCK_VIDEOS.map(video => (
              <div key={video.id} style={{ position: 'relative', aspectRatio: '9/16', borderRadius: 10, overflow: 'hidden', background: '#000', maxHeight: 300 }}>
                <img src={video.thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={20} color="white" fill="white" />
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.8))', padding: '20px 8px 8px', display: 'flex', gap: 8 }}>
                  <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>▶ {video.views}</span>
                  <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>❤ {video.likes}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'audience' && (
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>시청자 연령대</h3>
              {[['13~17세', 18], ['18~24세', 42], ['25~34세', 28], ['35~44세', 9], ['45세+', 3]].map(([age, pct]) => (
                <div key={age} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{age}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#FF2D55' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--border)', borderRadius: 3 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#FF2D55,#000)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>시청자 성별</h3>
                {[['여성', 58, '#FF2D55'], ['남성', 42, '#5B8DEF']].map(([label, pct, color]) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13 }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: color as string }}>{pct}%</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--border)', borderRadius: 4 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color as string, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>평균 조회수</h3>
                <p style={{ fontSize: 36, fontWeight: 900, color: '#FF2D55' }}>15.2K</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>영상당 평균 조회수</p>
                <p style={{ fontSize: 12, color: '#00C896', marginTop: 8, fontWeight: 600 }}>✓ 높은 바이럴 지수</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'service_desc' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>서비스 설명</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              안녕하세요, {profile.display_name}입니다!<br/><br/>
              {profile.bio_description}<br/><br/>
              트렌디한 틱톡 콘텐츠로 브랜드를 자연스럽게 노출시켜 드립니다.<br/>
              챌린지, 댄스, 일상 등 다양한 포맷으로 광고를 진행합니다.
            </p>
          </div>
        )}

        {tab === 'pricing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {TT_SERVICES.map(s => (
              <div key={s.type} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{s.type}</h3>
                    <p style={{ fontSize: 20, fontWeight: 900, color: '#FF2D55' }}>{s.price}</p>
                  </div>
                  <span style={{ fontSize: 12, background: 'rgba(255,45,85,0.08)', color: '#FF2D55', padding: '4px 12px', borderRadius: 20 }}>작업 {s.days}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>{s.desc}</p>
                <Link href={`/request/${id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px', background: 'linear-gradient(135deg,#FF2D55,#000)', color: 'white', textDecoration: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700 }}>
                  {s.type} 광고 요청하기
                </Link>
              </div>
            ))}
          </div>
        )}

        {tab === 'process' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>광고 진행 과정</h3>
            {[
              { step: 1, title: '광고 요청', desc: '광고주가 요청서 작성 후 전달', icon: '📝', time: '1일' },
              { step: 2, title: '콘텐츠 기획', desc: '트렌드에 맞는 콘텐츠 포맷 협의', icon: '💡', time: '1~2일' },
              { step: 3, title: '영상 촬영/편집', desc: '틱톡 영상 촬영 및 편집', icon: '🎬', time: '3~5일' },
              { step: 4, title: '피드백', desc: '영상 확인 및 수정', icon: '✏️', time: '1일' },
              { step: 5, title: '게시', desc: '틱톡 채널 게시 및 광고 진행', icon: '🎵', time: '1일' },
            ].map((item, i) => (
              <div key={item.step} style={{ display: 'flex', gap: 14, marginBottom: i < 4 ? 20 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#FF2D55,#000)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{item.icon}</div>
                  {i < 4 && <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 4, minHeight: 20 }} />}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>STEP {item.step}. {item.title}</p>
                    <span style={{ fontSize: 11, background: 'var(--bg-card2)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 20 }}>{item.time}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'reviews' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16 }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="#FFB800" color="#FFB800" />)}
              <span style={{ fontSize: 20, fontWeight: 900, color: '#FFB800', marginLeft: 4 }}>{profile.rating}</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({profile.reviewCount}개 리뷰)</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>아직 등록된 리뷰가 없어요</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}