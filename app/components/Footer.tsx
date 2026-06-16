'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--secondary)', marginTop: 60 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '32px 16px 24px' : '48px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: isMobile ? 28 : 40, marginBottom: 32 }}>
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: 13 }}>♥</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 15 }}>라이크버튼</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>인플루언서와 브랜드를 연결하는<br />국내 최대 마케팅 플랫폼</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>서비스</h4>
            {[['인플루언서 검색', '/search'], ['트렌드 분석', '/trends'], ['레퍼런스', '/reference'], ['안전결제', '/']].map(([item, href]) => (
              <Link key={item} href={href} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 7 }}>{item}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>고객센터</h4>
            {[['공지사항', '/cs'], ['이벤트', '/cs'], ['FAQ', '/cs'], ['Q&A', '/cs']].map(([item, href]) => (
              <Link key={item} href={href} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 7 }}>{item}</Link>
            ))}
          </div>
          {!isMobile && (
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>약관</h4>
              {[['서비스 이용약관', '/terms'], ['개인정보 취급방침', '/terms'], ['전자금융거래 이용약관', '/terms']].map(([item, href]) => (
                <Link key={item} href={href} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12, marginBottom: 7 }}>{item}</Link>
              ))}
            </div>
          )}
        </div>
        {isMobile && (
          <div style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[['서비스 이용약관', '/terms'], ['개인정보 취급방침', '/terms'], ['전자금융거래', '/terms']].map(([item, href]) => (
              <Link key={item} href={href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12 }}>{item}</Link>
            ))}
          </div>
        )}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>© 2024 라이크버튼 All rights reserved.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { icon: '📺', url: 'https://youtube.com', label: 'YouTube' },
              { icon: '📸', url: 'https://instagram.com', label: 'Instagram' },
              { icon: '📘', url: 'https://facebook.com', label: 'Facebook' },
              { icon: '📝', url: 'https://blog.naver.com', label: 'Blog' },
            ].map(sns => (
              <a key={sns.label} href={sns.url} target="_blank" rel="noreferrer" title={sns.label}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{sns.icon}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
