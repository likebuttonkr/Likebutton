'use client';
import { showToast } from '../components/Toast';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Check } from 'lucide-react';

export default function FindAccountPage() {
  const [tab, setTab] = useState<'id'|'password'>('id');

  // 아이디 찾기
  const [phone, setPhone] = useState('');
  const [idResult, setIdResult] = useState<'found'|'notfound'|null>(null);
  const [foundEmail, setFoundEmail] = useState('');
  const [idLoading, setIdLoading] = useState(false);

  // 비밀번호 찾기
  const [email, setEmail] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSent, setPwSent] = useState(false);
  const [pwError, setPwError] = useState('');

  const handleFindId = async () => {
    if (!phone) { showToast('휴대폰번호를 입력해주세요.', 'warning'); return; }
    setIdLoading(true);
    // 실제로는 phone으로 검색
    const { data } = await supabase.from('profiles').select('email').eq('phone', phone).single();
    setIdLoading(false);
    if (data?.email) {
      // 이메일 마스킹: abc***@email.com
      const [local, domain] = data.email.split('@');
      const masked = local.slice(0, Math.max(2, local.length - 3)) + '***@' + domain;
      setFoundEmail(masked);
      setIdResult('found');
    } else {
      setIdResult('notfound');
    }
  };

  const handleFindPassword = async () => {
    if (!email) { setPwError('이메일을 입력해주세요.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setPwError('올바른 이메일 형식을 입력해주세요.'); return; }
    setPwLoading(true); setPwError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setPwLoading(false);
    if (error) { setPwError('이메일 발송에 실패했습니다. 가입된 이메일인지 확인해주세요.'); return; }
    setPwSent(true);
  };

  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 24 }}>
            <ArrowLeft size={15} /> 로그인으로 돌아가기
          </Link>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            {/* 탭 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
              {[['id','아이디 찾기'], ['password','비밀번호 찾기']].map(([val, label]) => (
                <button key={val} onClick={() => setTab(val as any)}
                  style={{ padding: '16px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: tab === val ? 700 : 500, background: 'transparent', color: tab === val ? '#FF2D55' : 'var(--text-muted)', borderBottom: tab === val ? '2px solid #FF2D55' : '2px solid transparent', transition: 'all 0.2s' }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ padding: '28px' }}>
              {/* 아이디 찾기 */}
              {tab === 'id' && (
                <div>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                    가입 시 등록한 휴대폰번호를 입력하세요
                  </p>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>휴대폰번호</label>
                    <input value={phone} onChange={e => { setPhone(e.target.value); setIdResult(null); }}
                      placeholder="010-0000-0000" onKeyDown={e => e.key === 'Enter' && handleFindId()} />
                  </div>
                  <button onClick={handleFindId} disabled={idLoading}
                    style={{ width: '100%', padding: '13px', background: idLoading ? 'var(--border)' : 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: idLoading ? 'not-allowed' : 'pointer' }}>
                    {idLoading ? '조회 중...' : '아이디 찾기'}
                  </button>

                  {/* 결과 */}
                  {idResult === 'found' && (
                    <div style={{ marginTop: 16, padding: '16px', background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Check size={16} color="#00C896" />
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#00C896' }}>아이디 찾기 결과</p>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.6 }}>
                        입력하신 정보와 일치하는 아이디는 다음과 같습니다.<br />
                        개인정보 보호를 위해 일부분은 *으로 표시됩니다.
                      </p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>{foundEmail}</p>
                      <Link href="/login" style={{ display: 'block', padding: '10px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, textAlign: 'center' }}>
                        로그인
                      </Link>
                    </div>
                  )}
                  {idResult === 'notfound' && (
                    <div style={{ marginTop: 16, padding: '14px', background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 10 }}>
                      <p style={{ fontSize: 13, color: '#FF2D55', lineHeight: 1.6 }}>
                        입력하신 정보와 일치하는 아이디가 없습니다.<br />정보를 다시 확인하시고 시도해주세요.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 비밀번호 찾기 */}
              {tab === 'password' && (
                <div>
                  {pwSent ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 60, height: 60, background: 'rgba(0,200,150,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Check size={26} color="#00C896" />
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>이메일을 확인해주세요</h3>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20 }}>
                        <strong style={{ color: 'var(--text)' }}>{email}</strong>으로<br />비밀번호 재설정 링크를 발송했습니다.<br />
                        메일이 오지 않았다면 스팸함을 확인해주세요.
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => { setPwSent(false); setEmail(''); }}
                          style={{ flex: 1, padding: '11px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                          다시 발송
                        </button>
                        <Link href="/login" style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', borderRadius: 10, color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 700, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          로그인
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                        가입한 이메일 주소를 입력하시면<br />비밀번호 재설정 링크를 보내드립니다.
                      </p>
                      {pwError && (
                        <div style={{ padding: '10px 14px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, marginBottom: 14 }}>
                          <p style={{ fontSize: 13, color: '#FF2D55' }}>{pwError}</p>
                        </div>
                      )}
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>이메일 주소</label>
                        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setPwError(''); }}
                          placeholder="가입한 이메일 주소 입력" onKeyDown={e => e.key === 'Enter' && handleFindPassword()} />
                      </div>
                      <button onClick={handleFindPassword} disabled={pwLoading}
                        style={{ width: '100%', padding: '13px', background: pwLoading ? 'var(--border)' : 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: pwLoading ? 'not-allowed' : 'pointer' }}>
                        {pwLoading ? '발송 중...' : '비밀번호 재설정 링크 발송'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-muted)' }}>
            계정이 기억나셨나요?{' '}
            <Link href="/login" style={{ color: '#FF2D55', fontWeight: 700, textDecoration: 'none' }}>로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
