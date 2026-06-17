'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { showToast } from '../../components/Toast';
import { ArrowLeft, CheckCircle, Clock, MessageSquare, FileText, Star, ChevronDown, ChevronUp, ExternalLink, Check } from 'lucide-react';

const STEPS = [
  { id: 'request', label: '광고 시작', icon: '🚀' },
  { id: 'plan', label: '광고 기획안', icon: '📋' },
  { id: 'feedback', label: '영상 피드백', icon: '🎬' },
  { id: 'progress', label: '광고 진행', icon: '📢' },
  { id: 'complete', label: '광고 완료', icon: '✅' },
];

const STATUS_TO_STEP: Record<string, number> = {
  '광고 요청': 0, '입금 대기': 0, '광고 기획안': 1,
  '영상 피드백': 2, '광고 진행': 3, '광고 완료': 4,
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 댓글/코멘트 상태
  const [planComments, setPlanComments] = useState<any[]>([]);
  const [newPlanComment, setNewPlanComment] = useState('');
  const [planConfirmed, setPlanConfirmed] = useState(false);
  const [videoComments, setVideoComments] = useState<any[]>([]);
  const [newVideoComment, setNewVideoComment] = useState('');
  const [videoConfirmed, setVideoConfirmed] = useState(false);
  const [adConfirmed, setAdConfirmed] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); setAccessDenied(true); return; }

      // 유저 프로필
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setUserProfile(profile);

      // 프로젝트 로드
      const { data: proj } = await supabase.from('projects').select('*').eq('id', id).single();
      if (proj) {
        const isOwner = proj.advertiser_id === session.user.id || proj.influencer_id === session.user.id;
        if (!isOwner) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }
        setProject(proj);
        setCurrentStep(STATUS_TO_STEP[proj.status] ?? 0);
        setPlanConfirmed(['영상 피드백', '광고 진행', '광고 완료'].includes(proj.status));
        setVideoConfirmed(['광고 진행', '광고 완료'].includes(proj.status));
        setAdConfirmed(proj.status === '광고 완료');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const addPlanComment = () => {
    if (!newPlanComment.trim()) return;
    setPlanComments(c => [...c, { author: userProfile?.name || '나', content: newPlanComment, date: new Date().toLocaleString('ko-KR'), isMe: true }]);
    setNewPlanComment('');
    showToast('코멘트가 등록되었습니다.', 'success');
  };

  const addVideoComment = () => {
    if (!newVideoComment.trim()) return;
    setVideoComments(c => [...c, { author: userProfile?.name || '나', content: newVideoComment, time: '00:00', date: new Date().toLocaleString('ko-KR'), isMe: true }]);
    setNewVideoComment('');
    showToast('피드백이 등록되었습니다.', 'success');
  };

  const confirmPlan = async () => {
    await supabase.from('projects').update({ status: '영상 피드백' }).eq('id', id);
    setPlanConfirmed(true); setCurrentStep(2);
    showToast('광고 기획안이 확정되었습니다.', 'success');
  };

  const confirmVideo = async () => {
    await supabase.from('projects').update({ status: '광고 진행' }).eq('id', id);
    setVideoConfirmed(true); setCurrentStep(3);
    showToast('영상 피드백이 확정되었습니다.', 'success');
  };

  const confirmAd = async () => {
    await supabase.from('projects').update({ status: '광고 완료' }).eq('id', id);
    setAdConfirmed(true); setCurrentStep(4);
    showToast('광고 진행이 확정되었습니다.', 'success');
  };

  const submitReview = async () => {
    if (!reviewText.trim() || reviewSubmitting) return;
    setReviewSubmitting(true);
    const { error } = await supabase.from('projects').update({ review_rating: rating, review_text: reviewText }).eq('id', id);
    if (error) {
      showToast('리뷰 등록에 실패했습니다. 다시 시도해주세요.', 'error');
      setReviewSubmitting(false);
      return;
    }
    setReviewSubmitted(true);
    showToast('리뷰가 등록되었습니다.', 'success');
  };

  if (loading) return (
    <div><Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>로딩 중...</p>
      </div>
    </div>
  );

  if (accessDenied) return (
    <div><Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 36 }}>🔒</p>
        <p style={{ color: 'var(--text-muted)' }}>이 프로젝트에 접근할 권한이 없어요</p>
        <Link href="/mypage" style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 700 }}>마이페이지로</Link>
      </div>
    </div>
  );

  if (!project) return (
    <div><Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 36 }}>😅</p>
        <p style={{ color: 'var(--text-muted)' }}>프로젝트를 찾을 수 없어요</p>
        <Link href="/mypage" style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 700 }}>마이페이지로</Link>
      </div>
    </div>
  );

  const trendColor = (t: string) => t === 'NEW' ? '#FF2D55' : t?.startsWith('▲') ? '#00C896' : '#FF6B35';

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>
        <Link href="/mypage" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 24, fontWeight: 500 }}>
          <ArrowLeft size={15} /> 프로젝트 관리로 돌아가기
        </Link>

        {/* 프로젝트 헤더 */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>{STEPS[currentStep]?.label}</span>
                <span style={{ fontSize: 11, background: 'var(--bg-card2)', color: 'var(--text-muted)', padding: '2px 10px', borderRadius: 20 }}>{project.platform || '유튜브'}</span>
              </div>
              <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, marginBottom: 8 }}>{project.title}</h1>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[`광고 형태: ${project.ad_type || '-'}`, `예산: ${project.budget?.toLocaleString() || '-'}원`].map(item => (
                  <span key={item} style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-card2)', padding: '3px 10px', borderRadius: 20 }}>{item}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>총 주문금액 (VAT 포함)</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#FF2D55' }}>{project.budget?.toLocaleString() || '0'}원</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>주문번호 #{String(id).padStart(6, '0')}</p>
            </div>
          </div>
        </div>

        {/* 진행 단계 */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', gap: 0 }}>
            {STEPS.map((step, i) => {
              const isDone = i < currentStep;
              const isCurr = i === currentStep;
              return (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: isMobile ? 60 : 80 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, borderRadius: '50%', background: isDone ? '#00C896' : isCurr ? '#FF2D55' : 'var(--bg-card2)', border: `2px solid ${isDone ? '#00C896' : isCurr ? '#FF2D55' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6, flexShrink: 0 }}>
                      {isDone ? <CheckCircle size={16} color="white" /> : isCurr ? <Clock size={14} color="white" /> : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{i + 1}</span>}
                    </div>
                    <p style={{ fontSize: isMobile ? 10 : 12, fontWeight: isCurr ? 700 : 500, color: isCurr ? '#FF2D55' : isDone ? '#00C896' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{step.label}</p>
                  </div>
                  {i < STEPS.length - 1 && <div style={{ height: 2, flex: 1, background: isDone ? '#00C896' : 'var(--border)', marginBottom: 18, minWidth: 12 }} />}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 20, alignItems: 'start' }}>
          <div>
            {/* 광고 기획안 */}
            {currentStep >= 1 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} color="#FF2D55" /> 광고 기획안</h2>
                  <span style={{ fontSize: 11, fontWeight: 700, color: planConfirmed ? '#00C896' : '#FFB800', background: planConfirmed ? 'rgba(0,200,150,0.1)' : 'rgba(255,184,0,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                    {planConfirmed ? '확정 완료' : '검토중'}
                  </span>
                </div>
                <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '16px', marginBottom: 16 }}>
                  {[
                    { label: '프로젝트명', value: project.title },
                    { label: '광고 형태', value: project.ad_type },
                    { label: '타겟층', value: project.target || '-' },
                    { label: '키워드', value: project.keyword || '-' },
                    { label: '릴리즈 예정일', value: project.release_date || '-' },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '100px 1fr', gap: isMobile ? 2 : 8, marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{f.label}</span>
                      <span>{f.value}</span>
                    </div>
                  ))}
                  {project.product_info && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>제품/서비스 정보</p>
                      <p style={{ fontSize: 13, lineHeight: 1.7 }}>{project.product_info}</p>
                    </div>
                  )}
                </div>
                {/* 코멘트 */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>코멘트</p>
                  {planComments.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>아직 코멘트가 없어요</p>}
                  {planComments.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, flexDirection: c.isMe ? 'row-reverse' : 'row' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: c.isMe ? 'linear-gradient(135deg,#5B8DEF,#8B5CF6)' : 'linear-gradient(135deg,#FF2D55,#FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                        {c.author[0]}
                      </div>
                      <div style={{ maxWidth: '70%' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, justifyContent: c.isMe ? 'flex-end' : 'flex-start' }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{c.author}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.date}</span>
                        </div>
                        <div style={{ background: c.isMe ? 'rgba(255,45,85,0.08)' : 'var(--bg-card2)', border: `1px solid ${c.isMe ? 'rgba(255,45,85,0.2)' : 'var(--border)'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, lineHeight: 1.5 }}>
                          {c.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>나</div>
                    <div style={{ flex: 1 }}>
                      <textarea value={newPlanComment} onChange={e => setNewPlanComment(e.target.value)} placeholder="코멘트를 입력하세요..."
                        style={{ width: '100%', minHeight: 70, padding: '10px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <button onClick={addPlanComment} disabled={!newPlanComment.trim()}
                          style={{ padding: '7px 16px', background: newPlanComment.trim() ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 8, cursor: newPlanComment.trim() ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600 }}>
                          코멘트 추가
                        </button>
                        {!planConfirmed && currentStep === 1 && (
                          <button onClick={confirmPlan} style={{ padding: '7px 16px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00C896', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                            기획안 확정
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 영상 피드백 */}
            {currentStep >= 2 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800 }}>🎬 영상 피드백</h2>
                  <span style={{ fontSize: 11, fontWeight: 700, color: videoConfirmed ? '#00C896' : '#FF2D55', background: videoConfirmed ? 'rgba(0,200,150,0.1)' : 'rgba(255,45,85,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                    {videoConfirmed ? '확정 완료' : '피드백 진행중'}
                  </span>
                </div>
                {project.video_url ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 10, overflow: 'hidden', marginBottom: 16, background: '#000' }}>
                    <iframe src={project.video_url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} allowFullScreen title="피드백 영상" />
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '20px', textAlign: 'center', marginBottom: 16 }}>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>인플루언서가 영상을 준비 중이에요</p>
                  </div>
                )}
                <div>
                  {videoComments.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>아직 피드백이 없어요</p>}
                  {videoComments.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                        {c.author[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{c.author}</span>
                          {c.time && <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '1px 6px', borderRadius: 10, fontWeight: 600 }}>[{c.time}]</span>}
                        </div>
                        <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>{c.content}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>나</div>
                    <div style={{ flex: 1 }}>
                      <textarea value={newVideoComment} onChange={e => setNewVideoComment(e.target.value)} placeholder="영상 피드백을 입력하세요..."
                        style={{ width: '100%', minHeight: 70, padding: '10px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <button onClick={addVideoComment} disabled={!newVideoComment.trim()}
                          style={{ padding: '7px 16px', background: newVideoComment.trim() ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 8, cursor: newVideoComment.trim() ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600 }}>
                          피드백 추가
                        </button>
                        {!videoConfirmed && currentStep === 2 && (
                          <button onClick={confirmVideo} style={{ padding: '7px 16px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00C896', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                            영상 피드백 확정
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 광고 진행 */}
            {currentStep >= 3 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800 }}>📢 광고 진행</h2>
                  <span style={{ fontSize: 11, fontWeight: 700, color: adConfirmed ? '#00C896' : '#5B8DEF', background: adConfirmed ? 'rgba(0,200,150,0.1)' : 'rgba(91,141,239,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                    {adConfirmed ? '확정 완료' : '게시 완료'}
                  </span>
                </div>
                {project.ad_video_url ? (
                  <a href={project.ad_video_url} target="_blank" rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                    <ExternalLink size={14} /> 광고 영상 보기
                  </a>
                ) : (
                  <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '20px', textAlign: 'center', marginBottom: 16 }}>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>인플루언서가 광고 게시를 준비 중이에요</p>
                  </div>
                )}
                {!adConfirmed && currentStep === 3 && (
                  <button onClick={confirmAd} style={{ padding: '9px 20px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00C896', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                    광고 진행 확정
                  </button>
                )}
              </div>
            )}

            {/* 광고 완료 - 리뷰 */}
            {currentStep >= 4 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>✅ 광고 완료 - 리뷰 등록</h2>
                {reviewSubmitted || project.review_rating ? (
                  <div style={{ padding: '20px', background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 10, textAlign: 'center' }}>
                    <Check size={24} color="#00C896" style={{ marginBottom: 8 }} />
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#00C896' }}>리뷰가 등록되었습니다!</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 8 }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < (project.review_rating || rating) ? '#FFB800' : 'transparent'} color="#FFB800" />)}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{project.review_text || reviewText}</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>별점</p>
                      <div style={{ display: 'flex', gap: 2, position: 'relative', height: 28 }}>
                        {[1,2,3,4,5].map(s => (
                          <div key={s} style={{ position: 'relative', width: 28, height: 28 }}>
                            {/* 왼쪽 반(0.5점) */}
                            <button onClick={() => setRating(s - 0.5)}
                              style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', background: 'none', border: 'none', cursor: 'pointer', zIndex: 2, padding: 0 }} />
                            {/* 오른쪽 반(1점) */}
                            <button onClick={() => setRating(s)}
                              style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', background: 'none', border: 'none', cursor: 'pointer', zIndex: 2, padding: 0 }} />
                            {/* 별 렌더링 */}
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
                              {rating >= s ? (
                                <Star size={26} fill="#FFB800" color="#FFB800" />
                              ) : rating >= s - 0.5 ? (
                                <div style={{ position: 'relative', width: 26, height: 26 }}>
                                  <Star size={26} fill="transparent" color="#FFB800" style={{ position: 'absolute' }} />
                                  <div style={{ position: 'absolute', left: 0, top: 0, width: '50%', overflow: 'hidden' }}>
                                    <Star size={26} fill="#FFB800" color="#FFB800" />
                                  </div>
                                </div>
                              ) : (
                                <Star size={26} fill="transparent" color="#FFB800" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#FFB800' }}>{rating}</span>
                    </div>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="광고 진행 후기를 남겨주세요..."
                      style={{ width: '100%', minHeight: 100, padding: '12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }} />
                    <button onClick={submitReview} disabled={!reviewText.trim() || reviewSubmitting}
                      style={{ padding: '10px 24px', background: reviewText.trim() && !reviewSubmitting ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 8, cursor: reviewText.trim() && !reviewSubmitting ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 700 }}>
                      {reviewSubmitting ? '등록 중...' : '리뷰 등록'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 88 }}>
            <Link href="/messages" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', borderRadius: 10, color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
              <MessageSquare size={16} /> 대화하기
            </Link>
            {(project.status === '광고 요청' || project.status === '입금 대기') && (
              <button onClick={async () => {
                if (!window.confirm('광고 요청을 취소하시겠어요?\n취소 후 복구가 불가능합니다.')) return;
                await supabase.from('projects').update({ status: '광고 요청 취소' }).eq('id', id);
                showToast('광고 요청이 취소되었습니다.', 'info');
                setTimeout(() => window.location.href = '/mypage', 1500);
              }}
                style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,45,85,0.3)', borderRadius: 10, color: '#FF2D55', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
                광고 요청 취소
              </button>
            )}

            {/* 광고 요청 열람 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
              <button onClick={() => setShowRequestInfo(!showRequestInfo)}
                style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text)' }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>광고 요청 열람</span>
                {showRequestInfo ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              {showRequestInfo && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
                  {[
                    { label: '프로젝트명', value: project.title },
                    { label: '광고 형태', value: project.ad_type || '-' },
                    { label: '예산', value: project.budget ? `${project.budget.toLocaleString()}원` : '-' },
                    { label: '타겟층', value: project.target || '-' },
                    { label: '키워드', value: project.keyword || '-' },
                    { label: '릴리즈 예정일', value: project.release_date || '-' },
                  ].map(info => (
                    <div key={info.label} style={{ paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>{info.label}</span>
                      <span style={{ fontSize: 13 }}>{info.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 결제 정보 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px' }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>결제 정보</p>
              {[
                { label: '주문번호', value: `#${String(id).padStart(6, '0')}` },
                { label: '광고 금액', value: `${project.budget?.toLocaleString() || '0'}원` },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{info.label}</span>
                  <span style={{ fontWeight: 600 }}>{info.value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>결제 금액</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#FF2D55' }}>{project.budget?.toLocaleString() || '0'}원</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => showToast('세금계산서가 이메일로 발송되었습니다.', 'success')}
                  style={{ width: '100%', padding: '9px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  🧾 세금계산서 확인
                </button>
                <button onClick={() => showToast('계약서가 이메일로 발송되었습니다.', 'success')}
                  style={{ width: '100%', padding: '9px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  📄 계약서 열람
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
