'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ArrowLeft, CheckCircle, Circle, Clock, FileText, MessageSquare, Upload, ChevronRight } from 'lucide-react';

const STEPS = [
  { id: 'request', label: '광고 시작', desc: '광고 계약 완료 / 입금 완료' },
  { id: 'plan', label: '광고 기획안', desc: '기획안 작성 및 확정' },
  { id: 'feedback', label: '영상 피드백', desc: '영상 초안 검토 및 피드백' },
  { id: 'progress', label: '광고 진행', desc: '영상 업로드 및 광고 진행' },
  { id: 'complete', label: '광고 완료', desc: '정산 및 리뷰 작성' },
];

const PROJECT = {
  id: 1,
  title: '신제품 런칭 캠페인',
  influencer: '워크맨',
  channel: '유튜브',
  advertiser: '뷰티코리아',
  currentStep: 2,
  price: '5,000,000',
  type: '브랜디드, PPL',
  requestDate: '2024.03.01',
  releaseDate: '2024.03.30',
  keyword: '뷰티, 립스틱, 신제품',
  target: '20~30대 여성',
  product: '신제품 립스틱 컬렉션 5종',
  point: '자연스러운 발색, 오래 지속되는 지속력',
  reference: 'https://www.youtube.com/watch?v=example',
  license: '예',
};

const HISTORY = [
  { step: '광고 시작', date: '2024.03.01 14:30', desc: '광고 계약이 체결되었습니다.' },
  { step: '입금 완료', date: '2024.03.02 10:15', desc: '광고비 5,000,000원 입금이 확인되었습니다.' },
  { step: '광고 기획안', date: '2024.03.05 16:00', desc: '광고 기획안이 제출되었습니다. 검토 후 피드백을 남겨주세요.' },
];

const PLAN_FIELDS = [
  { label: '업로드 채널', value: '유튜브 메인 채널' },
  { label: '서비스/광고 형태', value: '브랜디드 콘텐츠' },
  { label: '촬영 일시', value: '2024.03.20' },
  { label: '촬영 장소', value: '스튜디오 A' },
  { label: '예상 출연자', value: '워크맨 본인' },
  { label: '주요 내용', value: '신제품 립스틱 5종 리뷰 및 일상 브이로그 자연스럽게 녹여 소개' },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const currentStep = PROJECT.currentStep;

  return (
    <div>
      <Header isLoggedIn={true} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        <Link href="/mypage" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 24, fontWeight: 500 }}
          className="hover:text-white">
          <ArrowLeft size={16} /> 마이페이지로 돌아가기
        </Link>

        {/* Project header */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{PROJECT.title}</h1>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  `인플루언서: ${PROJECT.influencer}`,
                  `플랫폼: ${PROJECT.channel}`,
                  `광고주: ${PROJECT.advertiser}`,
                  `광고 형태: ${PROJECT.type}`,
                ].map(item => (
                  <span key={item} style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-card2)', padding: '3px 10px', borderRadius: 20 }}>{item}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>총 광고비</p>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#FF2D55' }}>{parseInt(PROJECT.price).toLocaleString()}원</p>
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>진행 상황</h2>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
            {STEPS.map((step, i) => {
              const isDone = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: 100 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: isDone ? '#00C896' : isCurrent ? '#FF2D55' : 'var(--bg-card2)', border: `2px solid ${isDone ? '#00C896' : isCurrent ? '#FF2D55' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, flexShrink: 0 }}>
                      {isDone ? <CheckCircle size={18} color="white" fill="#00C896" /> : isCurrent ? <Clock size={16} color="white" /> : <Circle size={16} color="var(--text-muted)" />}
                    </div>
                    <p style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#FF2D55' : isDone ? '#00C896' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{step.label}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 2, lineHeight: 1.3 }}>{step.desc}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ height: 2, flex: 1, background: isDone ? '#00C896' : 'var(--border)', marginTop: 17, minWidth: 16 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          <div>
            {/* Timeline */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>진행 이력</h2>
              {HISTORY.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < HISTORY.length - 1 ? 16 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF2D55', flexShrink: 0, marginTop: 3 }} />
                    {i < HISTORY.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingBottom: i < HISTORY.length - 1 ? 8 : 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{h.step}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.date}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ad plan */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} color="#FF2D55" /> 광고 기획안</h2>
                <span style={{ fontSize: 11, background: 'rgba(255,184,0,0.15)', color: '#FFB800', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>검토중</span>
              </div>
              {PLAN_FIELDS.map(f => (
                <div key={f.label} style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600, minWidth: 90, flexShrink: 0 }}>{f.label}</span>
                  <span style={{ color: 'var(--text)' }}>{f.value}</span>
                </div>
              ))}

              {/* Feedback input */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>피드백 남기기</p>
                {feedbackSent ? (
                  <div style={{ padding: '12px 16px', background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={16} color="#00C896" />
                    <span style={{ fontSize: 13, color: '#00C896' }}>피드백이 전송되었습니다!</span>
                  </div>
                ) : (
                  <>
                    <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)}
                      placeholder="기획안에 대한 의견이나 수정 요청사항을 입력해주세요..."
                      style={{ width: '100%', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '12px', fontSize: 13, resize: 'vertical', minHeight: 100, outline: 'none', boxSizing: 'border-box' }} />
                    <button onClick={() => { if (feedbackText.trim()) setFeedbackSent(true); }}
                      disabled={!feedbackText.trim()}
                      style={{ marginTop: 8, padding: '10px 20px', background: feedbackText.trim() ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--border)', color: feedbackText.trim() ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: 8, fontWeight: 600, cursor: feedbackText.trim() ? 'pointer' : 'not-allowed', fontSize: 13 }}>
                      피드백 제출
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, marginBottom: 14 }}>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>광고 요청 정보</p>
              {[
                { label: '광고 요청일', value: PROJECT.requestDate },
                { label: '릴리즈 일정', value: PROJECT.releaseDate },
                { label: '타겟층', value: PROJECT.target },
                { label: '대표 키워드', value: PROJECT.keyword },
                { label: '2차 라이선스', value: PROJECT.license },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{info.label}</span>
                  <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: 160 }}>{info.value}</span>
                </div>
              ))}
            </div>
            <Link href="/messages" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              <MessageSquare size={16} /> 대화하기
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
