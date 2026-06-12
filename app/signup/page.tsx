'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../components/Header';
import { Check, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const TERMS = [
  { id: 'service', title: '서비스 이용약관', required: true, content: '라이크버튼 서비스 이용약관입니다. 본 약관은 라이크버튼이 제공하는 인플루언서 마케팅 플랫폼 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.' },
  { id: 'privacy', title: '개인정보 취급방침', required: true, content: '라이크버튼은 회원의 개인정보를 중요시하며, 개인정보보호법에 따라 회원의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.' },
  { id: 'finance', title: '전자금융거래 이용약관', required: true, content: '이 약관은 라이크버튼이 제공하는 전자금융거래 서비스를 이용함에 있어 회사와 이용자 사이의 전자금융거래에 관한 기본적인 사항을 정함을 목적으로 합니다.' },
  { id: 'notice', title: '안내사항', required: true, content: '라이크버튼 서비스 이용 시 다음 사항을 반드시 확인하시기 바랍니다. 본 서비스는 인플루언서와 광고주를 연결하는 중개 플랫폼입니다.' },
];

function SignupContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'advertiser'|'influencer'>((params.get('type') as any) || 'influencer');
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', name: '', company: '', phone: '' });
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailCheckMsg, setEmailCheckMsg] = useState('');
  const [terms, setTerms] = useState<Record<string,boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [agreeSms, setAgreeSms] = useState(false);

  const update = (k: string, v: string) => { setForm(f => ({...f, [k]: v})); if (k === 'email') { setEmailChecked(false); setEmailCheckMsg(''); } };
  const allTermsAgreed = TERMS.every(t => terms[t.id]);

  const checkEmail = async () => {
    if (!form.email) { setEmailCheckMsg('이메일을 입력해주세요.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setEmailCheckMsg('이메일 양식을 확인해주세요.'); return; }
    const { data } = await supabase.from('profiles').select('id').eq('email', form.email).single();
    if (data) { setEmailCheckMsg('동일한 이메일이 있습니다.'); setEmailChecked(false); }
    else { setEmailCheckMsg('사용 가능한 이메일입니다.'); setEmailChecked(true); }
  };

  const handleStep1Next = () => {
    if (!form.email || !form.password || !form.passwordConfirm) { setError('모든 항목을 입력해주세요.'); return; }
    if (!emailChecked) { setError('이메일 중복확인을 해주세요.'); return; }
    if (form.password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    setError(''); setStep(2);
  };

  const handleStep2Next = () => {
    if (!allTermsAgreed) { setError('필수 약관에 모두 동의해주세요.'); return; }
    setError(''); setStep(3);
  };

  const handleSubmit = async () => {
    if (!form.name) { setError('이름을 입력해주세요.'); return; }
    setLoading(true); setError('');
    const { data, error: signUpError } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id, email: form.email, name: form.name, user_type: userType,
        company: form.company || null, phone: form.phone || null,
      });
      setStep(4);
    }
    setLoading(false);
  };

  if (step === 4) return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ width: 72, height: 72, background: 'rgba(0,200,150,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check size={36} color="#00C896" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>회원가입 완료! 🎉</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          {userType === 'advertiser'
            ? '회원가입 신청이 완료되었습니다.\n관리자 검토 후 5영업일 이내 승인 메일을 보내드립니다.'
            : '이메일 인증 메일을 보내드렸어요.\n메일함을 확인하고 인증 후 로그인해주세요!'}
        </p>
        <Link href={userType === 'influencer' ? '/login' : '/'} style={{ padding: '14px 36px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>
          {userType === 'influencer' ? '로그인하러 가기' : '메인으로 가기'}
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        {/* 진행 단계 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {['약관동의', '회원정보입력', '가입완료'].map((label, i) => {
            const s = i + 2;
            const active = step === s;
            const done = step > s;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: done ? '#00C896' : active ? '#FF2D55' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: done || active ? 'white' : 'var(--text-muted)' }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: active ? '#FF2D55' : done ? '#00C896' : 'var(--text-muted)', fontWeight: active ? 700 : 400 }}>{label}</span>
                </div>
                {i < 2 && <ChevronRight size={12} color="var(--text-muted)" />}
              </div>
            );
          })}
        </div>

        {/* 유저 타입 선택 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[{type: 'influencer', label: '인플루언서', icon: '🎬'}, {type: 'advertiser', label: '광고주', icon: '🏢'}].map(opt => (
            <button key={opt.type} onClick={() => setUserType(opt.type as any)}
              style={{ padding: '16px', borderRadius: 12, border: `2px solid ${userType === opt.type ? '#FF2D55' : 'var(--border)'}`, background: userType === opt.type ? 'rgba(255,45,85,0.08)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: userType === opt.type ? '#FF2D55' : 'var(--text)' }}>{opt.label}</div>
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          {error && <div style={{ padding: '10px 14px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 13, color: '#FF2D55' }}>{error}</div>}

          {/* Step 1: 이메일/비밀번호 */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>아이디 (이메일) *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="이메일을 입력해주세요" style={{ flex: 1 }} />
                  <button onClick={checkEmail} style={{ padding: '0 14px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>중복확인</button>
                </div>
                {emailCheckMsg && <p style={{ fontSize: 12, marginTop: 4, color: emailChecked ? '#00C896' : '#FF2D55' }}>{emailCheckMsg}</p>}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>비밀번호 * (6자 이상)</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="비밀번호를 입력해주세요" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>비밀번호 재입력 *</label>
                <input type="password" value={form.passwordConfirm} onChange={e => update('passwordConfirm', e.target.value)} placeholder="비밀번호를 한 번 더 입력해주세요" />
                {form.passwordConfirm && <p style={{ fontSize: 12, marginTop: 4, color: form.password === form.passwordConfirm ? '#00C896' : '#FF2D55' }}>{form.password === form.passwordConfirm ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}</p>}
              </div>
              <button onClick={handleStep1Next} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>다음</button>
            </>
          )}

          {/* Step 2: 약관동의 */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'var(--bg-card2)', borderRadius: 8, cursor: 'pointer', marginBottom: 12 }}>
                  <input type="checkbox" checked={allTermsAgreed} onChange={e => { const v = e.target.checked; setTerms(Object.fromEntries(TERMS.map(t => [t.id, v]))); }} style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: 14, fontWeight: 700 }}>전체 동의</span>
                </label>
                {TERMS.map(term => (
                  <div key={term.id} style={{ border: '1px solid var(--border)', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', cursor: 'pointer', background: terms[term.id] ? 'rgba(0,200,150,0.04)' : 'transparent' }}>
                      <input type="checkbox" checked={!!terms[term.id]} onChange={e => setTerms(t => ({...t, [term.id]: e.target.checked}))} style={{ width: 15, height: 15, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, flex: 1 }}>[필수] {term.title}</span>
                      {terms[term.id] && <Check size={14} color="#00C896" />}
                    </label>
                    <div style={{ padding: '10px 14px', background: 'var(--bg-card2)', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{term.content}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>이전</button>
                <button onClick={handleStep2Next} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>다음</button>
              </div>
            </>
          )}

          {/* Step 3: 회원정보 입력 */}
          {step === 3 && (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{userType === 'advertiser' ? '담당자 이름' : '닉네임'} *</label>
                <input value={form.name} onChange={e => update('name', e.target.value)} placeholder={userType === 'advertiser' ? '홍길동' : '채널 닉네임'} />
              </div>
              {userType === 'advertiser' && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>회사명 *</label>
                  <input value={form.company} onChange={e => update('company', e.target.value)} placeholder="회사명을 입력해주세요" />
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>휴대폰번호</label>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 8 }}>
                  <input value="010" readOnly style={{ textAlign: 'center' }} />
                  <input placeholder="0000" maxLength={4} />
                  <input placeholder="0000" maxLength={4} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', marginBottom: 8 }}>
                  <input type="checkbox" checked={agreeEmail} onChange={e => setAgreeEmail(e.target.checked)} style={{ width: 14, height: 14 }} />
                  이메일 수신을 동의합니다.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={agreeSms} onChange={e => setAgreeSms(e.target.checked)} style={{ width: 14, height: 14 }} />
                  SMS 수신을 동의합니다.
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>이전</button>
                <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '14px', background: loading ? 'var(--border)' : 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? '처리 중...' : userType === 'advertiser' ? '가입 신청 완료' : '가입 완료'}
                </button>
              </div>
            </>
          )}
        </div>
        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: 'var(--text-muted)' }}>
          이미 계정이 있으신가요? <Link href="/login" style={{ color: '#FF2D55', fontWeight: 700, textDecoration: 'none' }}>로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>로딩 중...</div>}>
        <SignupContent />
      </Suspense>
    </div>
  );
}
