'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

const REFERENCES = [
  { id: 1, brand: '삼성전자', category: '전자/가전', influencer: '워크맨', platform: '유튜브', views: '2,847,000', result: '브랜드 인지도 340% 상승', tag: '브랜디드', img: '🖥️' },
  { id: 2, brand: '오뚜기', category: '식품', influencer: '헤이지니', platform: '유튜브', views: '1,234,000', result: '신제품 출시 1주일 완판', tag: 'PPL', img: '🍜' },
  { id: 3, brand: '나이키 코리아', category: '스포츠/패션', influencer: '핏블리', platform: '인스타그램', views: '890,000', result: '신발 라인 매출 220% 증가', tag: '게시글', img: '👟' },
  { id: 4, brand: '카카오뱅크', category: '금융', influencer: '슈카월드', platform: '유튜브', views: '3,102,000', result: '앱 다운로드 15만 건', tag: '브랜디드', img: '🏦' },
  { id: 5, brand: '배달의민족', category: '앱서비스', influencer: '침착맨', platform: '유튜브', views: '4,521,000', result: '신규 가입자 28만 명', tag: 'PPL', img: '🛵' },
  { id: 6, brand: 'LG생활건강', category: '뷰티', influencer: '이사배', platform: '유튜브', views: '987,000', result: '제품 판매량 180% 상승', tag: '브랜디드', img: '💄' },
];

const CLIENTS = ['삼성전자', '현대자동차', '카카오', '네이버', '쿠팡', 'LG전자', '오뚜기', '나이키', '배달의민족', '카카오뱅크', 'CJ제일제당', '아모레퍼시픽'];

const TAG_COLORS: Record<string, string> = {
  '브랜디드': '#FF2D55',
  'PPL': '#FF6B35',
  '게시글': '#FFB800',
};

export default function ReferencePage() {
  return (
    <div>
      <Header />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>광고 레퍼런스</h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>라이크버튼을 통해 성공한 광고 사례를 확인하세요</p>
        </div>

        {/* Client logos */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, textAlign: 'center' }}>주요 광고주</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {CLIENTS.map(c => (
              <div key={c} style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{c}</div>
            ))}
          </div>
        </div>

        {/* Reference cards */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>성공 사례</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {REFERENCES.map(ref => (
              <div key={ref.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: 140, background: 'linear-gradient(135deg, var(--bg-card2), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                  {ref.img}
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{ref.brand}</h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ref.category}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: TAG_COLORS[ref.tag] || '#888', background: `${TAG_COLORS[ref.tag] || '#888'}18`, padding: '3px 10px', borderRadius: 20 }}>{ref.tag}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{ref.platform}</span>
                    <span style={{ fontSize: 11, background: 'var(--bg-card2)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 4 }}>인플루언서: {ref.influencer}</span>
                    <span style={{ fontSize: 11, background: 'var(--bg-card2)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 4 }}>조회수: {ref.views}</span>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 8 }}>
                    <p style={{ fontSize: 13, color: '#00C896', fontWeight: 700 }}>📈 {ref.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px', background: 'linear-gradient(135deg, rgba(255,45,85,0.08), rgba(255,107,53,0.08))', borderRadius: 20, border: '1px solid rgba(255,45,85,0.2)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>다음 성공 사례의 주인공이 되세요</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24 }}>라이크버튼과 함께 효과적인 인플루언서 마케팅을 시작하세요</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/signup?type=advertiser" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>광고주로 시작하기</Link>
            <Link href="/search" style={{ padding: '12px 28px', background: 'var(--bg-card)', color: 'var(--text)', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, border: '1px solid var(--border)' }}>인플루언서 둘러보기</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
