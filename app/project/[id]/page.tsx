'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ArrowLeft, CheckCircle, Clock, Circle, MessageSquare, FileText, Star, ChevronDown, ChevronUp, ExternalLink, Check } from 'lucide-react';

const STEPS = [
  { id: 'request', label: '광고 시작', icon: '🚀' },
  { id: 'plan', label: '광고 기획안', icon: '📋' },
  { id: 'feedback', label: '영상 피드백', icon: '🎬' },
  { id: 'progress', label: '광고 진행', icon: '📢' },
  { id: 'complete', label: '광고 완료', icon: '✅' },
];

// 샘플 프로젝트 데이터 (실제는 DB에서)
const MOCK_PROJECT = {
  id: 1,
  title: '신제품 런칭 캠페인',
  influencer: '워크맨',
  channel: '워크맨 유튜브',
  platform: '유튜브',
  advertiser: '뷰티코리아',
  currentStep: 2, // 0:광고시작, 1:기획안, 2:영상피드백, 3:광고진행, 4:완료
  price: 5000000,
  type: '브랜디드, PPL',
  workDays: 25,
  requestDate: '2024.03.01 12:21',
  releaseDate: '2024.03.25',
  target: '20~30대 여성',
  keyword: '뷰티, 립스틱, 신제품',
  product: '신제품 립스틱 컬렉션 5종',
  point: '자연스러운 발색, 오래 지속되는 지속력',
  reference: 'https://www.youtube.com/watch?v=example',
  license: '예',
  orderNum: '202403010001',
  coupon: 50000,
};

const MOCK_HISTORY = [
  { step: '광고 시작', date: '2024.03.01 14:30', desc: '광고 계약 / 입금 완료', done: true },
  { step: '광고 기획안', date: '2024.03.05 16:00', desc: '기획안 제출 완료 → 확정 일시: 2024.03.06 10:00', done: true },
  { step: '영상 피드백', date: '2024.03.07 12:21', desc: '영상 피드백 진행 중', current: true },
  { step: '광고 진행', date: '2024.03.25 예정', desc: '', upcoming: true },
  { step: '광고 완료', date: '', desc: '', upcoming: true },
];

const PLAN_DATA = {
  uploadChannel: '유튜브 워크맨 메인 채널',
  adType: '브랜디드 콘텐츠',
  shootDate: '2024.03.20',
  shootPlace: '서울 스튜디오 A',
  cast: '워크맨 본인',
  title: '[브이로그] 워크맨이 써본 뷰티 신제품 5가지',
  mainContent: '신제품 립스틱 5종을 자연스러운 일상 브이로그에 녹여 소개합니다. 실제 사용감과 발색을 솔직하게 리뷰하며, 제품의 장점을 자연스럽게 전달합니다.',
  etc: '영상 후반부에 구매 링크 및 할인 코드 삽입 예정',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project] = useState(MOCK_PROJECT);
  const [currentStep] = useState(MOCK_PROJECT.currentStep);
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 광고 기획안 상태
  const [planComments, setPlanComments] = useState([
    { author: '워크맨', content: '기획안 초안 제출했습니다. 검토 부탁드립니다!', date: '2024.03.05 16:00', isInfluencer: true },
    { author: '뷰티코리아', content: '전반적으로 좋습니다. 후반부 제품 노출 시간을 조금 더 늘려주실 수 있을까요?', date: '2024.03.06 09:30', isInfluencer: false },
  ]);
  const [newPlanComment, setNewPlanComment] = useState('');
  const [planConfirmed, setPlanConfirmed] = useState(false);

  // 영상 피드백 상태
  const [videoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [videoComments, setVideoComments] = useState([
    { author: '워크맨', content: '초안 영상 업로드했습니다!', time: '00:00', date: '2024.03.10 14:00', isInfluencer: true },
    { author: '뷰티코리아', content: '02:30 부분에서 제품명을 좀 더 명확히 언급해주세요.', time: '02:30', date: '2024.03.10 15:20', isInfluencer: false },
  ]);
  const [newVideoComment, setNewVideoComment] = useState('');
  const [videoConfirmed, setVideoConfirmed] = useState(false);

  // 광고 진행 상태
  const [adVideoUrl] = useState('');
  const [adConfirmed, setAdConfirmed] = useState(false);

  // 리뷰 상태
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const addPlanComment = () => {
    if (!newPlanComment.trim()) return;
    setPlanComments(c => [...c, { author: '나', content: newPlanComment, date: new Date().toLocaleString('ko-KR'), isInfluencer: false }]);
    setNewPlanComment('');
  };

  const addVideoComment = () => {
    if (!newVideoComment.trim()) return;
    setVideoComments(c => [...c, { author: '나', content: newVideoComment, time: '00:00', date: new Date().toLocaleString('ko-KR'), isInfluencer: false }]);
    setNewVideoComment('');
  };

  return (
    <div>
      <Header isLoggedIn={true} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>

        <Link href="/mypage" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 24, fontWeight: 500 }}>
          <ArrowLeft size={15} /> 프로젝트 관리로 돌아가기
        </Link>

        {/* 프로젝트 헤더 */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>
                  {STEPS[currentStep]?.label}
                </span>
                <span style={{ fontSize: 11, background: 'var(--bg-card2)', color: 'var(--text-muted)', padding: '2px 10px', borderRadius: 20 }}>{project.platform}</span>
              </div>
              <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, marginBottom: 8 }}>{project.title}</h1>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[`인플루언서: ${project.influencer}`, `광고 형태: ${project.type}`, `작업일: ${project.workDays}일`].map(item => (
                  <span key={item} style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-card2)', padding: '3px 10px', borderRadius: 20 }}>{item}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>총 주문금액 (VAT 포함)</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#FF2D55' }}>{project.price.toLocaleString()}원</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>주문번호 #{project.orderNum}</p>
            </div>
          </div>
        </div>

        {/* 진행 단계 */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
            {STEPS.map((step, i) => {
              const isDone = i < currentStep;
              const isCurr = i === currentStep;
              return (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: isMobile ? 60 : 80 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, borderRadius: '50%', background: isDone ? '#00C896' : isCurr ? '#FF2D55' : 'var(--bg-card2)', border: `2px solid ${isDone ? '#00C896' : isCurr ? '#FF2D55' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6, flexShrink: 0, fontSize: isMobile ? 14 : 16 }}>
                      {isDone ? <CheckCircle size={16} color="white" /> : isCurr ? <Clock size={14} color="white" /> : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{i + 1}</span>}
                    </div>
                    <p style={{ fontSize: isMobile ? 10 : 12, fontWeight: isCurr ? 700 : 500, color: isCurr ? '#FF2D55' : isDone ? '#00C896' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{step.label}</p>
                  </div>
                  {i < STEPS.length - 1 && <div style={{ height: 2, flex: 1, background: isDone ? '#00C896' : 'var(--border)', marginBottom: 18, minWidth: 12 }} />}
                </div>
              );
            })}
          </div>

          {/* 진행 이력 */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            {MOCK_HISTORY.filter(h => !h.upcoming || h.step === STEPS[currentStep + 1]?.label).map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.done ? '#00C896' : h.current ? '#FF2D55' : 'var(--border)', marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{h.step}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.date}</span>
                  </div>
                  {h.desc && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{h.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 20, alignItems: 'start' }}>
          {/* 메인 영역 */}
          <div>

            {/* ===== 광고 기획안 단계 ===== */}
            {currentStep >= 1 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={16} color="#FF2D55" /> 광고 기획안
                  </h2>
                  <span style={{ fontSize: 11, fontWeight: 700, color: planConfirmed ? '#00C896' : '#FFB800', background: planConfirmed ? 'rgba(0,200,150,0.1)' : 'rgba(255,184,0,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                    {planConfirmed ? '확정 완료' : '검토중'}
                  </span>
                </div>

                {/* 기획안 내용 */}
                <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '16px', marginBottom: 16 }}>
                  {[
                    { label: '업로드 채널', value: PLAN_DATA.uploadChannel },
                    { label: '서비스/광고 형태', value: PLAN_DATA.adType },
                    { label: '촬영 일시', value: PLAN_DATA.shootDate },
                    { label: '촬영 장소', value: PLAN_DATA.shootPlace },
                    { label: '예상 출연자', value: PLAN_DATA.cast },
                    { label: '제목', value: PLAN_DATA.title },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 8, marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{f.label}</span>
                      <span>{f.value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>주요 내용</p>
                    <p style={{ fontSize: 13, lineHeight: 1.7 }}>{PLAN_DATA.mainContent}</p>
                  </div>
                  {PLAN_DATA.etc && (
                    <div style={{ marginTop: 10 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>기타</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{PLAN_DATA.etc}</p>
                    </div>
                  )}
                </div>

                {/* 코멘트 영역 */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>코멘트</p>
                  {planComments.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, flexDirection: c.isInfluencer ? 'row' : 'row-reverse' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: c.isInfluencer ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'linear-gradient(135deg,#5B8DEF,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                        {c.author[0]}
                      </div>
                      <div style={{ maxWidth: '70%' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, justifyContent: c.isInfluencer ? 'flex-start' : 'flex-end' }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{c.author}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.date}</span>
                        </div>
                        <div style={{ background: c.isInfluencer ? 'var(--bg-card2)' : 'rgba(255,45,85,0.08)', border: `1px solid ${c.isInfluencer ? 'var(--border)' : 'rgba(255,45,85,0.2)'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, lineHeight: 1.5 }}>
                          {c.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>나</div>
                    <div style={{ flex: 1 }}>
                      <textarea value={newPlanComment} onChange={e => setNewPlanComment(e.target.value)}
                        placeholder="코멘트를 입력하세요..."
                        style={{ width: '100%', minHeight: 70, padding: '10px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <button onClick={addPlanComment} disabled={!newPlanComment.trim()}
                          style={{ padding: '7px 16px', background: newPlanComment.trim() ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 8, cursor: newPlanComment.trim() ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600 }}>
                          코멘트 추가
                        </button>
                        {!planConfirmed && currentStep === 1 && (
                          <button onClick={() => { if (confirm('광고 기획안을 확정하시겠어요? 확정 후에는 수정이 불가능합니다.')) setPlanConfirmed(true); }}
                            style={{ padding: '7px 16px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00C896', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                            광고 기획안 확정
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== 영상 피드백 단계 ===== */}
            {currentStep >= 2 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                    🎬 영상 피드백
                  </h2>
                  <span style={{ fontSize: 11, fontWeight: 700, color: videoConfirmed ? '#00C896' : '#FF2D55', background: videoConfirmed ? 'rgba(0,200,150,0.1)' : 'rgba(255,45,85,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                    {videoConfirmed ? '확정 완료' : '피드백 진행중'}
                  </span>
                </div>

                {/* 영상 플레이어 */}
                {currentStep === 2 ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 10, overflow: 'hidden', marginBottom: 16, background: '#000' }}>
                    <iframe src={videoUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} allowFullScreen title="피드백 영상" />
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '20px', textAlign: 'center', marginBottom: 16 }}>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>인플루언서가 영상을 준비하고 있습니다. 영상 등록을 기다려주세요.</p>
                  </div>
                )}

                {/* 영상 코멘트 */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>영상 피드백 코멘트</p>
                  {videoComments.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: c.isInfluencer ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'linear-gradient(135deg,#5B8DEF,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                        {c.author[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{c.author}</span>
                          {c.time && <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '1px 6px', borderRadius: 10, fontWeight: 600 }}>[{c.time}]</span>}
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.date}</span>
                        </div>
                        <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13, lineHeight: 1.5 }}>
                          {c.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#5B8DEF,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>나</div>
                    <div style={{ flex: 1 }}>
                      <textarea value={newVideoComment} onChange={e => setNewVideoComment(e.target.value)}
                        placeholder="영상 피드백 코멘트를 입력하세요..."
                        style={{ width: '100%', minHeight: 70, padding: '10px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <button onClick={addVideoComment} disabled={!newVideoComment.trim()}
                          style={{ padding: '7px 16px', background: newVideoComment.trim() ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 8, cursor: newVideoComment.trim() ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 600 }}>
                          코멘트 추가
                        </button>
                        {!videoConfirmed && currentStep === 2 && (
                          <button onClick={() => { if (confirm('영상 피드백을 확정하시겠어요?')) setVideoConfirmed(true); }}
                            style={{ padding: '7px 16px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00C896', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                            영상 피드백 확정
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== 광고 진행 단계 ===== */}
            {currentStep >= 3 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800 }}>📢 광고 진행</h2>
                  <span style={{ fontSize: 11, fontWeight: 700, color: adConfirmed ? '#00C896' : '#5B8DEF', background: adConfirmed ? 'rgba(0,200,150,0.1)' : 'rgba(91,141,239,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                    {adConfirmed ? '확정 완료' : '게시 완료'}
                  </span>
                </div>
                {adVideoUrl ? (
                  <div style={{ marginBottom: 16 }}>
                    <a href={adVideoUrl} target="_blank" rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                      <ExternalLink size={14} /> 광고 영상 보기
                    </a>
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '20px', textAlign: 'center', marginBottom: 16 }}>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>인플루언서가 광고 게시를 준비하고 있습니다.</p>
                  </div>
                )}
                {!adConfirmed && currentStep === 3 && adVideoUrl && (
                  <button onClick={() => { if (confirm('광고 진행을 확정하시겠어요?')) setAdConfirmed(true); }}
                    style={{ padding: '9px 20px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00C896', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                    광고 진행 확정
                  </button>
                )}
              </div>
            )}

            {/* ===== 광고 완료 - 리뷰 단계 ===== */}
            {currentStep >= 4 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>✅ 광고 완료 - 리뷰 등록</h2>
                {reviewSubmitted ? (
                  <div style={{ padding: '20px', background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 10, textAlign: 'center' }}>
                    <Check size={24} color="#00C896" style={{ marginBottom: 8 }} />
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#00C896' }}>리뷰가 등록되었습니다!</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 8 }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < rating ? '#FFB800' : 'transparent'} color="#FFB800" />)}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{reviewText}</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>별점</p>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => setRating(s)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                            <Star size={24} fill={s <= rating ? '#FFB800' : 'transparent'} color="#FFB800" />
                          </button>
                        ))}
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#FFB800' }}>{rating}.0</span>
                    </div>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                      placeholder="광고 진행 후기를 남겨주세요..."
                      style={{ width: '100%', minHeight: 100, padding: '12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }} />
                    <button onClick={() => { if (confirm('리뷰를 등록하시겠어요?')) setReviewSubmitted(true); }}
                      disabled={!reviewText.trim()}
                      style={{ padding: '10px 24px', background: reviewText.trim() ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 8, cursor: reviewText.trim() ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 700 }}>
                      리뷰 등록
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 우측 사이드바 */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 88 }}>
            {/* 대화하기 버튼 */}
            <Link href="/messages" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', borderRadius: 10, color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
              <MessageSquare size={16} /> 대화하기
            </Link>

            {/* 광고 요청 정보 */}
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
                    { label: '릴리즈 일정', value: project.releaseDate },
                    { label: '광고 형태', value: project.type },
                    { label: '예상 광고비', value: `${project.price.toLocaleString()}원~` },
                    { label: '타겟층', value: project.target },
                    { label: '대표 키워드', value: project.keyword },
                    { label: '서비스/제품 정보', value: project.product },
                    { label: '소구 포인트', value: project.point },
                    { label: '레퍼런스', value: project.reference },
                    { label: '2차 라이선스', value: project.license },
                  ].map(info => (
                    <div key={info.label} style={{ paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{info.label}</span>
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
                { label: '주문번호', value: `#${project.orderNum}` },
                { label: '광고 금액', value: `${project.price.toLocaleString()}원` },
                { label: '쿠폰 할인', value: project.coupon ? `-${project.coupon.toLocaleString()}원` : '-' },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{info.label}</span>
                  <span style={{ fontWeight: 600, color: info.label === '쿠폰 할인' ? '#00C896' : 'var(--text)' }}>{info.value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>결제 금액</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#FF2D55' }}>{(project.price - project.coupon).toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
