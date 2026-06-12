'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'influencer'|'advertiser'>('influencer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError('이메일 또는 비밀번호가 올바르지 않습니다.'); }
    else { router.push('/mypage'); }
    setLoading(false);
  };

  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>♥</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>로그인</h1>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px' }}>
            {/* 탭 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-card2)', borderRadius: 8, padding: 4, marginBottom: 20 }}>
              {(['influencer','advertiser'] as const).map(type => (
                <button key={type} onClick={() => setUserType(type)}
                  style={{ padding: '8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: userType === type ? 'var(--bg-card)' : 'transparent', color: userType === type ? 'var(--text)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                  {type === 'influencer' ? '인플루언서' : '광고주'}
                </button>
              ))}
            </div>
            {error && <div style={{ padding: '10px 14px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 13, color: '#FF2D55' }}>{error}</div>}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>아이디 (이메일)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일을 입력해주세요" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요" style={{ paddingRight: 42 }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)} style={{ width: 14, height: 14 }} />
                자동 로그인
              </label>
              <Link href="/find-account" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-white">아이디, 비밀번호 찾기 &gt;</Link>
            </div>
            <button onClick={handleLogin} disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? 'var(--border)' : 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 14 }}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>또는</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <button style={{ width: '100%', padding: '12px', background: '#FEE500', color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 8 }}>카카오로 로그인</button>
            <button style={{ width: '100%', padding: '12px', background: 'white', color: '#333', border: '1px solid #ddd', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Google로 로그인</button>
          </div>
          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: 'var(--text-muted)' }}>
            계정이 없으신가요? <Link href="/signup" style={{ color: '#FF2D55', fontWeight: 700, textDecoration: 'none' }}>회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
