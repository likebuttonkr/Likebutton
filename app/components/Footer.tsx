import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--secondary)', marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: 14 }}>♥</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>라이크버튼</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>인플루언서와 브랜드를 연결하는<br />국내 최대 마케팅 플랫폼</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>서비스</h4>
            {['인플루언서 검색', '트렌드 분석', '레퍼런스', '안전결제'].map(item => (
              <Link key={item} href="/" style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 8 }} className="hover:text-white">{item}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>고객센터</h4>
            {['공지사항', '이벤트', 'FAQ', 'Q&A'].map(item => (
              <Link key={item} href="/" style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 8 }} className="hover:text-white">{item}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>약관</h4>
            {['서비스 이용약관', '개인정보 취급방침', '전자금융거래 이용약관'].map(item => (
              <Link key={item} href="/" style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 8 }} className="hover:text-white">{item}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>© 2024 라이크버튼 All rights reserved.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['📺', '📸', '🎵'].map((icon, i) => (
              <button key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>{icon}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
