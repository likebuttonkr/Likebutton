'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Check } from 'lucide-react';

export default function FindAccountPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) { setError('이메일을 입력해주세요.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('올바른 이메일 형식을 입력해주세요.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) { setError('이메일 발송에 실패했습니다. 가입된 이메일인지 확인해주세요.'); return; }
    setSent(true);
  };

  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 28 }}>
            <ArrowLeft size={15} /> 로그인으로 돌아가기
          </Link>

          {sent ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(0,200,150,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Check size={28} color="#00C896" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>이메일을 확인해주세요</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 8 }}>
                <strong style={{ color: 'var(--text)' }}>{email}</strong>으로<br />
                비밀번호 재설정 링크를 발송했습니다.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
                메일이 오지 않았다면 스팸함을 확인해주세요.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setSent(false); setEmail(''); }}
                  style={{ flex: 1, padding: '12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                  다시 발송
                </button>
                <Link href="/login" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', borderRadius: 10, color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 700, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  로그인
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 32px' }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 24 }}>🔑</div>
                <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>비밀번호 찾기</h1>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  가입한 이메일 주소를 입력하시면<br />비밀번호 재설정 링크를 보내드립니다.
                </p>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: '#FF2D55' }}>{error}</p>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: 'var(--text-muted)' }}>이메일 주소</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="가입한 이메일 주소 입력"
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </div>

              <button onClick={handleSubmit} disabled={loading}
                style={{ width: '100%', padding: '14px', background: loading ? 'var(--border)' : 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 16 }}>
                {loading ? '발송 중...' : '비밀번호 재설정 링크 발송'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                계정이 기억나셨나요?{' '}
                <Link href="/login" style={{ color: '#FF2D55', fontWeight: 700, textDecoration: 'none' }}>로그인</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
