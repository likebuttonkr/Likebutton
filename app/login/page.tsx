'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>♥</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>로그인</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>라이크버튼에 오신 것을 환영합니다</p>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px' }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>이메일</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
            </div>
            <div style={{ marginBottom: 24, position: 'relative' }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>비밀번호</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" style={{ paddingRight: 42 }} />
                <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <Link href="/" style={{ fontSize: 12, color: '#FF2D55', textDecoration: 'none' }}>비밀번호 찾기</Link>
              </div>
            </div>
            <button style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 14 }}>
              로그인
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>또는</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <button style={{ width: '100%', padding: '12px', background: '#FEE500', color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 8 }}>
              카카오로 로그인
            </button>
            <button style={{ width: '100%', padding: '12px', background: 'white', color: '#333', border: '1px solid #ddd', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Google로 로그인
            </button>
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            계정이 없으신가요? <Link href="/signup" style={{ color: '#FF2D55', fontWeight: 700, textDecoration: 'none' }}>회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
