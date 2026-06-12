'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

const NOTICES = [
  { id: 7, title: '라이크버튼 서비스 업데이트 안내', date: '2024.03.15' },
  { id: 6, title: '개인정보처리방침 개정 안내', date: '2024.03.10' },
  { id: 5, title: '안전결제 시스템 개선 안내', date: '2024.02.28' },
  { id: 4, title: '신규 카테고리 추가 안내', date: '2024.02.20' },
  { id: 3, title: '서비스 점검 안내 (2024.02.15)', date: '2024.02.14' },
  { id: 2, title: '인플루언서 등급제 도입 안내', date: '2024.01.30' },
  { id: 1, title: '라이크버튼 서비스 오픈 안내', date: '2024.01.01' },
];

const EVENTS = [
  { id: 1, title: '신규 가입 인플루언서 첫 프로젝트 수수료 면제 이벤트', period: '2024.03.01 ~ 2024.03.31', status: '진행중' },
  { id: 2, title: '광고주 첫 결제 10% 할인 쿠폰 증정', period: '2024.03.01 ~ 2024.03.31', status: '진행중' },
  { id: 3, title: '인플루언서 프로필 완성 이벤트', period: '2024.02.01 ~ 2024.02.28', status: '종료' },
];

const FAQS = [
  { q: '라이크버튼은 어떤 서비스인가요?', a: '라이크버튼은 브랜드(광고주)와 인플루언서를 연결하는 인플루언서 마케팅 플랫폼입니다. 유튜브, 인스타그램, 틱톡 인플루언서를 검색하고, 안전결제 시스템을 통해 광고를 진행할 수 있습니다.' },
  { q: '회원가입은 무료인가요?', a: '네, 회원가입은 완전 무료입니다. 광고주와 인플루언서 모두 무료로 가입하실 수 있습니다. 수수료는 프로젝트가 완료된 후에만 발생합니다.' },
  { q: '수수료는 얼마인가요?', a: '현재 수수료는 광고비의 10%입니다. 예를 들어 광고비가 1,000,000원인 경우 수수료는 100,000원이며, 인플루언서는 900,000원을 수령하게 됩니다.' },
  { q: '안전결제는 어떻게 동작하나요?', a: '안전결제는 에스크로 방식으로 운영됩니다. 광고주가 결제하면 라이크버튼이 보관하고 있다가, 광고 완료 후 인플루언서에게 지급합니다. 이를 통해 양측 모두 안전하게 거래할 수 있습니다.' },
  { q: '계약서는 어떻게 작성하나요?', a: '라이크버튼 내에서 표준 계약서 양식을 제공합니다. 광고주와 인플루언서가 각각 정보를 입력하고 전자서명을 진행하면 계약이 완료됩니다.' },
  { q: '인플루언서 검색 필터는 어떤 것이 있나요?', a: '구독자 수, 카테고리, 광고비 예산, 구독자 연령, 구독자 성별, 예상 조회수 등 다양한 필터로 원하는 인플루언서를 찾을 수 있습니다.' },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'notice'|'event'|'faq'|'qna'>('notice');
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const [eventTab, setEventTab] = useState<'ongoing'|'ended'>('ongoing');

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 28 }}>고객센터</h1>

        {/* 탭 */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {[['notice','공지사항'],['event','이벤트'],['faq','FAQ'],['qna','Q&A']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id as any)}
              style={{ flex: 1, padding: '10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === id ? 700 : 500, background: activeTab === id ? 'var(--bg-card2)' : 'transparent', color: activeTab === id ? 'var(--text)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* 공지사항 */}
        {activeTab === 'notice' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', width: 60 }}>번호</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>제목</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', width: 120 }}>등록일</th>
                </tr>
              </thead>
              <tbody>
                {NOTICES.map(n => (
                  <tr key={n.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} className="hover:bg-white/5">
                    <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-muted)' }}>{n.id}</td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500 }}>{n.title}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'right' }}>{n.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 이벤트 */}
        {activeTab === 'event' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[['ongoing','진행중인 이벤트'],['ended','종료된 이벤트']].map(([id, label]) => (
                <button key={id} onClick={() => setEventTab(id as any)}
                  style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, borderColor: eventTab === id ? '#FF2D55' : 'var(--border)', background: eventTab === id ? 'rgba(255,45,85,0.08)' : 'transparent', color: eventTab === id ? '#FF2D55' : 'var(--text-muted)' }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {EVENTS.filter(e => eventTab === 'ongoing' ? e.status === '진행중' : e.status === '종료').map(e => (
                <div key={e.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 80, height: 80, background: eventTab === 'ongoing' ? 'rgba(255,45,85,0.1)' : 'var(--bg-card2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                    {eventTab === 'ongoing' ? '🎉' : '📋'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{e.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>기간: {e.period}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: e.status === '진행중' ? '#00C896' : 'var(--text-muted)', background: e.status === '진행중' ? 'rgba(0,200,150,0.1)' : 'var(--bg-card2)', padding: '4px 12px', borderRadius: 20, flexShrink: 0 }}>{e.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '16px 20px', border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', display: 'flex', gap: 10 }}>
                    <span style={{ color: '#FF2D55', fontWeight: 800 }}>Q</span> {faq.q}
                  </span>
                  {openFaq === i ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ paddingTop: 14, display: 'flex', gap: 10 }}>
                      <span style={{ color: '#00C896', fontWeight: 800, fontSize: 14 }}>A</span>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{faq.a}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Q&A */}
        {activeTab === 'qna' && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>1:1 문의</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>로그인 후 1:1 문의를 남기시면<br />빠른 시간 내에 답변 드리겠습니다.</p>
            <Link href="/login" style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>로그인하고 문의하기</Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
