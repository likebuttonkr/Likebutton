'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, X, ChevronDown } from 'lucide-react';

export default function Header({ isLoggedIn = false, userType = '' }: { isLoggedIn?: boolean; userType?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [influencerDropdown, setInfluencerDropdown] = useState(false);

  return (
    <header style={{ background: 'rgba(15,15,26,0.95)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 16 }}>♥</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.5px' }}>라이크버튼</span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hidden md:flex">
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setInfluencerDropdown(true)}
            onMouseLeave={() => setInfluencerDropdown(false)}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '8px 14px', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, borderRadius: 8 }}
              className="hover:bg-white/5">
              인플루언서 검색 <ChevronDown size={14} />
            </button>
            {influencerDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, minWidth: 140, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                {['유튜브', '인스타그램', '틱톡'].map(p => (
                  <Link key={p} href={`/search?platform=${p}`}
                    style={{ display: 'block', padding: '8px 12px', color: 'var(--text)', textDecoration: 'none', borderRadius: 6, fontSize: 14 }}
                    className="hover:bg-white/5">{p}</Link>
                ))}
              </div>
            )}
          </div>
          {['트렌드 분석', '레퍼런스', '회사 소개'].map(item => (
            <Link key={item} href={`/${item === '트렌드 분석' ? 'trends' : item === '레퍼런스' ? 'reference' : 'about'}`}
              style={{ padding: '8px 14px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: 14, borderRadius: 8 }}
              className="hover:text-white hover:bg-white/5 transition-all">{item}</Link>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, borderRadius: 8 }} className="hover:text-white hover:bg-white/5">
            <Search size={18} />
          </button>
          {isLoggedIn ? (
            <>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, borderRadius: 8 }} className="hover:text-white hover:bg-white/5">
                <Bell size={18} />
              </button>
              <Link href="/mypage" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>U</div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{ padding: '8px 16px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, fontWeight: 500, borderRadius: 8 }} className="hover:text-white">로그인</Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '8px 16px', fontSize: 14, borderRadius: 8, fontWeight: 600, color: 'white', textDecoration: 'none', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)' }}>회원가입</Link>
            </>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: 8 }} className="md:hidden">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 24px', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="인플루언서 이름, 채널명으로 검색..." style={{ paddingLeft: 38, fontSize: 14 }} autoFocus
              onKeyDown={e => { if (e.key === 'Enter') window.location.href = `/search?q=${(e.target as HTMLInputElement).value}`; }} />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: '1px solid var(--border)', padding: 16, background: 'var(--bg)' }} className="md:hidden">
          {['유튜브', '인스타그램', '틱톡', '트렌드 분석', '레퍼런스', '회사 소개'].map(item => (
            <Link key={item} href="/" style={{ display: 'block', padding: '10px 4px', color: 'var(--text)', textDecoration: 'none', fontSize: 15 }}>{item}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
