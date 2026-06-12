'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

const NOTICES = [
  { id: 7, title: '라이크버튼 서비스 이용 안내', date: '2024.03.15' },
  { id: 6, title: '개인정보 처리방침 개정 안내', date: '2024.03.10' },
  { id: 5, title: '시스템 점검 안내 (03/20 02:00~06:00)', date: '2024.03.08' },
  { id: 4, title: '안전결제 서비스 이용 방법', date: '2024.02.28' },
  { id: 3, title: '인플루언서 등록 가이드', date: '2024.02.20' },
  { id: 2, title: '광고주 회원가입 및 이용 안내', date: '2024.02.15' },
  { id: 1, title: '라이크버튼 서비스 오픈 안내', date: '2024.02.01' },
];

const EVENTS = [
  { id: 1, title: '첫 광고 계약 10% 할인 이벤트', period: '2024.03.01 ~ 2024.03.31', status: '진행중' },
  { id: 2, title: '인플루언서 등록 프로모션', period: '2024.03.15 ~ 2024.04.15', status: '진행중' },
  { id: 3, title: '신규 가입 쿠폰 지급 이벤트', period: '2024.01.01 ~ 2024.01.31', status: '종료' },
];

const FAQS = [
  { q: '라이크버튼은 어떤 서비스인가요?', a: '라이크버튼은 광고주와 인플루언서를 연결하는 인플루언서 마케팅 플랫폼입니다. 유튜브, 인스타그램, 틱톡 인플루언서를 검색하고 안전하게 광고를 진행할 수 있습니다.' },
  { q: '안전결제란 무엇인가요?', a: '안전결제는 광고비를 플랫폼이 중간에서 보관하다가 광고가 정상적으로 완료되면 인플루언서에게 정산하는 서비스입니다. 광고주와 인플루언서 모두를 보호합니다.' },
  { q: '수수료는 얼마인가요?', a: '라이크버튼의 수수료는 광고 금액의 10%입니다. 수수료는 안전결제 시 자동으로 차감됩니다.' },
  { q: '인플루언서로 등록하려면 어떻게 해야 하나요?', a: '회원가입 시 인플루언서로 가입하신 후, 마이페이지 > 서비스 관리에서 채널을 등록하고 광고 서비스를 설정하시면 됩니다.' },
  { q: '광고 취소 및 환불은 어떻게 되나요?', a: '광고 진행 단계에 따라 취소 및 환불 정책이 다릅니다. 자세한 내용은 서비스 이용약관을 참고해주시거나 고객센터로 문의해주세요.' },
];

type TabType = 'notice' | 'event' | 'faq' | 'qna';

export default function CSPage() {
  const [tab, setTab] = useState<TabType>('notice');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [eventTab, setEventTab] = useState<'진행중' | '종료'>('진행중');

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>고객센터</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {[['notice', '공지사항'], ['event', '이벤트'], ['faq', 'FAQ'], ['qna', 'Q&A']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val as TabType)}
              style={{ flex: 1, padding: '10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: tab === val ? 700 : 500, background: tab === val ? 'var(--bg-card2)' : 'transparent', color: tab === val ? 'var(--text)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* 공지사항 */}
        {tab === 'notice' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card2)' }}>
                  {['번호', '제목', '등록일'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NOTICES.map(n => (
                  <tr key={n.id} style={{ borderTop: '1px solid var(--border)', cursor: 'pointer' }} className="hover:bg-white/5">
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)', width: 60 }}>{n.id}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500 }}>{n.title}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)', width: 120 }}>{n.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 이벤트 */}
        {tab === 'event' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {(['진행중', '종료'] as const).map(t => (
                <button key={t} onClick={() => setEventTab(t)}
                  style={{ padding: '8px 20px', borderRadius: 8, border: `1px solid ${eventTab === t ? '#FF2D55' : 'var(--border)'}`, background: eventTab === t ? 'rgba(255,45,85,0.1)' : 'transparent', color: eventTab === t ? '#FF2D55' : 'var(--text-muted)', fontSize: 14, fontWeight: eventTab === t ? 700 : 400, cursor: 'pointer' }}>
                  {t === '진행중' ? '진행중인 이벤트' : '종료된 이벤트'}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {EVENTS.filter(e => e.status === eventTab).map(ev => (
                <div key={ev.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 160, background: `linear-gradient(135deg, ${ev.status === '진행중' ? '#FF2D55, #FF6B35' : '#666, #444'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🎉</div>
                  <div style={{ padding: 16 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{ev.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ev.period}</p>
                    <span style={{ display: 'inline-block', marginTop: 8, fontSize: 11, fontWeight: 700, color: ev.status === '진행중' ? '#00C896' : 'var(--text-muted)', background: ev.status === '진행중' ? 'rgba(0,200,150,0.1)' : 'var(--bg-card2)', padding: '2px 8px', borderRadius: 20 }}>{ev.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {tab === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#FF2D55', fontWeight: 800 }}>Q</span> {faq.q}
                  </span>
                  {openFaq === i ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 16px', borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, paddingTop: 14, display: 'flex', gap: 10 }}>
                      <span style={{ color: '#00C896', fontWeight: 800, flexShrink: 0 }}>A</span> {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Q&A */}
        {tab === 'qna' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>✉️</p>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>1:1 문의하기</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>로그인 후 문의를 남겨주시면<br />빠르게 답변드리겠습니다.</p>
            <Link href="/login" style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>
              로그인하고 문의하기
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
