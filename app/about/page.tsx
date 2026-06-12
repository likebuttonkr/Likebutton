'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

const TEAM = [
  { name: '김라이크', role: 'CEO / 공동창업자', desc: '전 네이버 마케팅 팀장, 인플루언서 마케팅 10년 경력' },
  { name: '이버튼', role: 'CTO / 공동창업자', desc: '전 카카오 개발자, 플랫폼 개발 전문가' },
  { name: '박마케', role: 'CMO', desc: '브랜드 마케팅 전문가, 국내 주요 브랜드 캠페인 경력' },
];

const STATS = [
  { value: '50,000+', label: '등록 인플루언서' },
  { value: '3,000+', label: '광고주' },
  { value: '100억+', label: '누적 거래액' },
  { value: '4.9/5.0', label: '평균 만족도' },
];

const VALUES = [
  { icon: '🤝', title: '신뢰', desc: '안전결제 시스템으로 광고주와 인플루언서 모두를 보호합니다.' },
  { icon: '🎯', title: '정확성', desc: '데이터 기반의 정확한 인플루언서 매칭으로 효과를 극대화합니다.' },
  { icon: '💡', title: '혁신', desc: '끊임없는 기술 혁신으로 더 나은 마케팅 경험을 제공합니다.' },
  { icon: '🌱', title: '성장', desc: '광고주와 인플루언서가 함께 성장하는 생태계를 만듭니다.' },
];

export default function AboutPage() {
  return (
    <div>
      <Header />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(255,45,85,0.08), rgba(255,107,53,0.08))', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>♥</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>인플루언서 마케팅의<br />새로운 기준</h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32 }}>
            라이크버튼은 광고주와 인플루언서를 가장 안전하고 효율적으로 연결하는 플랫폼입니다.<br />
            데이터 기반의 정확한 매칭과 안전결제 시스템으로 믿을 수 있는 인플루언서 마케팅을 제공합니다.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/signup?type=advertiser" style={{ padding: '13px 28px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>광고주로 시작하기</Link>
            <Link href="/signup?type=influencer" style={{ padding: '13px 28px', background: 'var(--bg-card)', color: 'var(--text)', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, border: '1px solid var(--border)' }}>인플루언서로 등록하기</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 72 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '28px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14 }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#FF2D55', marginBottom: 6 }}>{s.value}</p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>우리의 미션</h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
            모든 크리에이터가 자신의 콘텐츠로 가치를 창출하고, 모든 브랜드가 최적의 인플루언서를 만날 수 있는 세상을 만듭니다.
          </p>
        </div>

        {/* Values */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32, textAlign: 'center' }}>핵심 가치</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ padding: '28px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{v.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32, textAlign: 'center' }}>팀</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TEAM.map(t => (
              <div key={t.name} style={{ padding: '28px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, fontWeight: 900, color: 'white' }}>{t.name[0]}</div>
                <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{t.name}</h3>
                <p style={{ fontSize: 13, color: '#FF2D55', fontWeight: 600, marginBottom: 8 }}>{t.role}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ textAlign: 'center', padding: '48px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>문의하기</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>비즈니스 문의 및 파트너십 제안은 아래로 연락주세요</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:hello@likebutton.kr" style={{ padding: '10px 20px', background: 'rgba(255,45,85,0.1)', color: '#FF2D55', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>📧 hello@likebutton.kr</a>
            <a href="tel:02-0000-0000" style={{ padding: '10px 20px', background: 'rgba(255,45,85,0.1)', color: '#FF2D55', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>📞 02-0000-0000</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
