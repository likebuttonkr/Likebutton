'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { supabase } from '../lib/supabase';
import { CheckCircle } from 'lucide-react';

export default function FindAccountPage() {
  const [tab, setTab] = useState<'id'|'pw'>('id');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [pwSent, setPwSent] = useState(false);

  const handleFindId = async () => {
    if (!phone) { setError('휴대폰번호를 입력해주세요.'); return; }
    setLoading(true); setError('');
    const { data } = await supabase.from('profiles').select('email').eq('phone', phone).single();
    if (data?.email) {
      const masked = data.email.replace(/(.{3}).*(@)/, (m: string, p1: string, p2: string) => p1 + '***' + p2);
      setResult(masked);
    } else { setError('입력하신 정보와 일치하는 아이디가 없습니다.'); }
    setLoading(false);
  };

  const handleFindPw = async () => {
    if (!email) { setError('이메일을 입력해주세요.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) { setError('이메일 발송에 실패했습니다.'); }
    else { setPwSent(true); }
    setLoading(false);
  };

  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, textAlign: 'center', marginBottom: 28 }}>아이디, 비밀번호 찾기</h1>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
              {(['id','pw'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setResult(''); setError(''); setPwSent(false); }}
                  style={{ padding: '14px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, background: tab === t ? 'var(--bg-card)' : 'var(--bg-card2)', color: tab === t ? '#FF2D55' : 'var(--text-muted)', borderBottom: tab === t ? '2px solid #FF2D55' : '2px solid transparent' }}>
                  {t === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
                </button>
              ))}
            </div>
            <div style={{ padding: 28 }}>
              {tab === 'id' ? (
                <>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>가입 시 등록한 휴대폰번호를 입력하세요</p>
                  {error && <div style={{ padding: '10px 14px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 13, color: '#FF2D55' }}>{error}</div>}
                  {result ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <CheckCircle size={40} color="#00C896" style={{ margin: '0 auto 12px', display: 'block' }} />
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>입력하신 정보와 일치하는 아이디는 다음과 같습니다.</p>
                      <p style={{ fontSize: 18, fontWeight: 900, color: '#FF2D55', marginBottom: 20 }}>{result}</p>
                      <Link href="/login" style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>로그인</Link>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>휴대폰번호</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" />
                      </div>
                      <button onClick={handleFindId} disabled={loading}
                        style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                        {loading ? '확인 중...' : '아이디 찾기'}
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>가입 시 등록한 아이디(이메일)를 입력하세요</p>
                  {error && <div style={{ padding: '10px 14px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 13, color: '#FF2D55' }}>{error}</div>}
                  {pwSent ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <CheckCircle size={40} color="#00C896" style={{ margin: '0 auto 12px', display: 'block' }} />
                      <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>비밀번호 재설정 이메일 발송 완료!</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>{email} 로 비밀번호 재설정 링크를 보내드렸어요.<br />메일함을 확인해주세요.</p>
                      <Link href="/login" style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>로그인</Link>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>아이디 (이메일)</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="가입한 이메일을 입력해주세요" />
                      </div>
                      <button onClick={handleFindPw} disabled={loading}
                        style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                        {loading ? '발송 중...' : '비밀번호 찾기'}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: 'var(--text-muted)' }}>
            <Link href="/login" style={{ color: '#FF2D55', textDecoration: 'none' }}>← 로그인으로 돌아가기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
