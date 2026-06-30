'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { showToast } from '../components/Toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    // Supabase가 URL의 access_token을 자동으로 세션에 설정해줌
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
      else {
        // URL hash에서 토큰 직접 파싱 (일부 브라우저에서 필요)
        const hash = window.location.hash;
        if (hash.includes('access_token')) {
          setReady(true);
        } else {
          showToast('유효하지 않은 링크입니다. 다시 시도해주세요.', 'error');
          router.push('/find-account');
        }
      }
    });
  }, []);

  const handleReset = async () => {
    if (!password) { showToast('새 비밀번호를 입력해주세요.', 'warning'); return; }
    if (password.length < 6) { showToast('비밀번호는 6자 이상이어야 합니다.', 'warning'); return; }
    if (password !== confirm) { showToast('비밀번호가 일치하지 않습니다.', 'warning'); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      showToast('비밀번호 변경에 실패했습니다. 링크가 만료됐을 수 있어요.', 'error');
      return;
    }
    showToast('비밀번호가 변경되었습니다!', 'success');
    setTimeout(() => router.push('/login'), 1500);
  };

  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '20px 16px' : '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: isMobile ? '28px 20px' : '40px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{ fontSize: 36, marginBottom: 10 }}>🔐</p>
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>새 비밀번호 설정</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>새로 사용할 비밀번호를 입력해주세요</p>
          </div>

          {!ready ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>링크 확인 중...</p>
          ) : (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>새 비밀번호</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="6자 이상 입력" style={{ fontSize: 14 }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>비밀번호 확인</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="비밀번호 재입력" style={{ fontSize: 14 }}
                  onKeyDown={e => e.key === 'Enter' && handleReset()} />
              </div>
              <button onClick={handleReset} disabled={loading}
                style={{ width: '100%', padding: '13px', background: loading ? 'var(--border)' : 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
