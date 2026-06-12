'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, X, ChevronDown } from 'lucide-react';

export default function Header({ isLoggedIn = false, userType = '' }: { isLoggedIn?: boolean; userType?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [influencerDropdown, setInfluencerDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const NAV_LINKS = [
    { label: '트렌드 분석', href: '/trends' },
    { label: '레퍼런스', href: '/reference' },
    { label: '회사 소개', href: '/about' },
    { label: '고객센터', href: '/cs' },
  ];

  return (
    <header style={{ background: 'rgba(15,15,26,0.97)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 15 }}>♥</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: isMobile ? 16 : 18, color: 'var(--text)', letterSpacing: '-0.5px' }}>라이크버튼</span>
        </Link>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setInfluencerDropdown(true)}
              onMouseLeave={() => setInfluencerDropdown(false)}>
              <button style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '7px 12px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, borderRadius: 8 }}>
                인플루언서 검색 <ChevronDown size={13} />
              </button>
              {influencerDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, minWidth: 130, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 200 }}>
                  {[['유튜브', '📺'], ['인스타그램', '📸'], ['틱톡', '🎵']].map(([p, icon]) => (
                    <Link key={p} href={`/search?platform=${p}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', color: 'var(--text)', textDecoration: 'none', borderRadius: 6, fontSize: 13 }}>
                      {icon} {p}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {NAV_LINKS.map(item => (
              <Link key={item.label} href={item.href}
                style={{ padding: '7px 12px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: 13, borderRadius: 8 }}>
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
            <Search size={18} />
          </button>
          {isLoggedIn ? (
            <>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                <Bell size={18} />
              </button>
              <Link href="/mypage" style={{ textDecoration: 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>U</div>
              </Link>
            </>
          ) : (
            <>
              {!isMobile && <Link href="/login" style={{ padding: '7px 14px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, fontWeight: 500, borderRadius: 8 }}>로그인</Link>}
              <Link href="/signup" style={{ padding: '7px 14px', fontSize: 13, borderRadius: 8, fontWeight: 600, color: 'white', textDecoration: 'none', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', whiteSpace: 'nowrap' }}>
                {isMobile ? '가입' : '회원가입'}
              </Link>
            </>
          )}
          {isMobile && (
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 8 }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '10px 16px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="인플루언서 이름, 채널명으로 검색..." style={{ paddingLeft: 36, fontSize: 14 }} autoFocus
              onKeyDown={e => { if (e.key === 'Enter') { window.location.href = `/search?q=${(e.target as HTMLInputElement).value}`; setSearchOpen(false); } }} />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && isMobile && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)', padding: '8px 16px 16px' }}>
          {/* 인플루언서 검색 */}
          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, padding: '10px 4px 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>인플루언서 검색</p>
          {[['유튜브', '/search?platform=유튜브', '📺'], ['인스타그램', '/search?platform=인스타그램', '📸'], ['틱톡', '/search?platform=틱톡', '🎵']].map(([label, href, icon]) => (
            <Link key={label} href={href} onClick={() => setMobileOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px', color: 'var(--text)', textDecoration: 'none', fontSize: 15, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>{icon}</span>{label}
            </Link>
          ))}
          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, padding: '12px 4px 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>메뉴</p>
          {NAV_LINKS.map(item => (
            <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '10px 4px', color: 'var(--text)', textDecoration: 'none', fontSize: 15, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {item.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Link href="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1, padding: '12px', textAlign: 'center', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>로그인</Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} style={{ flex: 1, padding: '12px', textAlign: 'center', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 10, color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>회원가입</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
