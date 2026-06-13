'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../components/Header';
import { Check, ChevronRight, Upload, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

const TERMS = [
  { id: 'service', title: '서비스 이용약관', required: true, content: '라이크버튼 서비스 이용약관입니다. 본 약관은 라이크버튼이 제공하는 인플루언서 마케팅 플랫폼 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.' },
  { id: 'privacy', title: '개인정보 취급방침', required: true, content: '라이크버튼은 회원의 개인정보를 중요시하며, 개인정보보호법에 따라 회원의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.' },
  { id: 'finance', title: '전자금융거래 이용약관', required: true, content: '이 약관은 라이크버튼이 제공하는 전자금융거래 서비스를 이용함에 있어 회사와 이용자 사이의 전자금융거래에 관한 기본적인 사항을 정함을 목적으로 합니다.' },
  { id: 'notice', title: '안내사항', required: true, content: '라이크버튼 서비스 이용 시 다음 사항을 반드시 확인하시기 바랍니다. 본 서비스는 인플루언서와 광고주를 연결하는 중개 플랫폼입니다.' },
];

const INDUSTRIES = ['IT/소프트웨어', '엔터테인먼트', '식품/음료', '패션/뷰티', '여행/숙박', '금융/보험', '교육', '의료/헬스케어', '부동산', '자동차', '스포츠/레저', '반려동물', '기타'];
const CATEGORIES = ['뷰티/패션', '음식/요리', '게임', '여행', '운동/스포츠', '엔터테인먼트', 'IT/테크', '교육', '라이프스타일', '경제/비즈니스'];

function SignupContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'advertiser'|'influencer'>((params.get('type') as any) || 'influencer');

  // 공통
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', name: '', company: '', phone: '' });
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailCheckMsg, setEmailCheckMsg] = useState('');
  const [terms, setTerms] = useState<Record<string,boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [agreeSms, setAgreeSms] = useState(false);

  // 인플루언서 SNS
  const [channelForm, setChannelForm] = useState({ youtube: '', instagram: '', tiktok: '' });
  const [channelVerified, setChannelVerified] = useState({ youtube: false, instagram: false, tiktok: false });
  const [channelChecking, setChannelChecking] = useState({ youtube: false, instagram: false, tiktok: false });

  // 광고주 추가 정보
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizEmailSent, setBizEmailSent] = useState(false);
  const [bizEmailVerified, setBizEmailVerified] = useState(false);
  const [bizFileName, setBizFileName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const update = (k: string, v: string) => {
    setForm(f => ({...f, [k]: v}));
    if (k === 'email') { setEmailChecked(false); setEmailCheckMsg(''); }
  };

  const allTermsAgreed = TERMS.every(t => terms[t.id]);

  const checkEmail = async () => {
    if (!form.email) { setEmailCheckMsg('이메일을 입력해주세요.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setEmailCheckMsg('이메일 양식을 확인해주세요.'); return; }
    const { data } = await supabase.from('profiles').select('id').eq('email', form.email).single();
    if (data) { setEmailCheckMsg('동일한 이메일이 있습니다.'); setEmailChecked(false); }
    else { setEmailCheckMsg('사용 가능한 이메일입니다.'); setEmailChecked(true); }
  };

  const handleStep1Next = () => {
    if (!form.email) { setError('이메일을 입력해주세요.'); return; }
    if (!emailChecked) { setError('이메일 중복확인을 해주세요.'); return; }
    if (!form.password || form.password.length < 6) { setError('비밀번호를 6자 이상 입력해주세요.'); return; }
    if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    setError(''); setStep(2);
  };

  const handleStep2Next = () => {
    if (!allTermsAgreed) { setError('모든 약관에 동의해주세요.'); return; }
    setError(''); setStep(3);
  };

  const handleStep3Next = () => {
    if (!form.name) { setError('이름을 입력해주세요.'); return; }
    if (userType === 'advertiser' && !form.company) { setError('회사명을 입력해주세요.'); return; }
    if (userType === 'advertiser' && !industry) { setError('업종을 선택해주세요.'); return; }
    if (userType === 'advertiser' && !bizEmailVerified) { setError('업무 이메일 인증을 완료해주세요.'); return; }
    setError('');
    if (userType === 'influencer') setStep(4);
    else handleSubmit();
  };

  const sendBizEmailVerification = async () => {
    if (!bizEmail) { alert('업무 이메일을 입력해주세요.'); return; }
    setBizEmailSent(true);
    // 실제로는 이메일 발송 API 호출
    setTimeout(() => setBizEmailVerified(true), 2000); // 데모용 자동 인증
  };

  const verifyChannel = async (platform: 'youtube' | 'instagram' | 'tiktok') => {
    const url = channelForm[platform];
    if (!url) { alert('채널 URL을 입력해주세요.'); return; }
    setChannelChecking(prev => ({ ...prev, [platform]: true }));
    await new Promise(r => setTimeout(r, 1500));
    setChannelVerified(prev => ({ ...prev, [platform]: true }));
    setChannelChecking(prev => ({ ...prev, [platform]: false }));
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email: form.email, password: form.password });
      if (signUpError) { setError(signUpError.message); setLoading(false); return; }
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: form.email,
          name: form.name,
          user_type: userType,
          company: form.company || null,
          phone: form.phone || null,
          channel_name: userType === 'influencer' ? (channelForm.youtube || channelForm.instagram || channelForm.tiktok) : null,
        });
        setStep(userType === 'influencer' ? 5 : 5);
      }
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  // 완료 화면
  if (step === 5) return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <div style={{ width: 72, height: 72, background: 'rgba(0,200,150,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check size={32} color="#00C896" />
        </div>
        {userType === 'influencer' ? (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>가입 완료! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
              이메일 인증 메일을 보내드렸어요.<br />메일함을 확인하고 인증 후 로그인해주세요!
            </p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>가입 신청 완료! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
              회원가입 신청을 완료해주셔서 감사합니다.<br />
              회원가입 정보가 성공적으로 제출되어<br />
              관리자 리뷰가 진행중입니다.<br /><br />
              <strong>업무일 기준 5일 이내</strong> 회원가입 신청<br />
              승인 관련 메일을 발송해드립니다.
            </p>
          </>
        )}
        <Link href={userType === 'influencer' ? '/login' : '/'} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>
          {userType === 'influencer' ? '로그인하러 가기' : '메인으로 가기'}
        </Link>
      </div>
    </div>
  );

  // 진행 단계 표시
  const STEPS = userType === 'influencer'
    ? ['이메일 입력', '약관동의', '회원정보', 'SNS 인증']
    : ['이메일 입력', '약관동의', '회원정보'];

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* 단계 표시 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
          {STEPS.map((label, i) => {
            const s = i + 1;
            const active = step === s;
            const done = step > s;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: done ? '#00C896' : active ? '#FF2D55' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: done || active ? 'white' : 'var(--text-muted)' }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 11, color: active ? '#FF2D55' : done ? '#00C896' : 'var(--text-muted)', fontWeight: active ? 700 : 400 }}>{label}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight size={11} color="var(--text-muted)" />}
              </div>
            );
          })}
        </div>

        {/* 유저 타입 선택 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[{type: 'influencer', label: '인플루언서', icon: '🎬', desc: '크리에이터'}, {type: 'advertiser', label: '광고주', icon: '🏢', desc: '브랜드/기업'}].map(opt => (
            <button key={opt.type} onClick={() => { setUserType(opt.type as any); setStep(1); setError(''); }}
              style={{ padding: '14px', borderRadius: 12, border: `2px solid ${userType === opt.type ? '#FF2D55' : 'var(--border)'}`, background: userType === opt.type ? 'rgba(255,45,85,0.08)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{opt.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: userType === opt.type ? '#FF2D55' : 'var(--text)' }}>{opt.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{opt.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
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
                {form.passwordConfirm && <p style={{ fontSize: 12, marginTop: 4, color: form.password === form.passwordConfirm ? '#00C896' : '#FF2D55' }}>{form.password === form.passwordConfirm ? '✓ 비밀번호가 일치합니다.' : '✗ 비밀번호가 일치하지 않습니다.'}</p>}
              </div>
              <button onClick={handleStep1Next} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>다음</button>
            </>
          )}

          {/* Step 2: 약관동의 */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'var(--bg-card2)', borderRadius: 8, cursor: 'pointer', marginBottom: 10 }}>
                  <input type="checkbox" checked={allTermsAgreed} onChange={e => { const v = e.target.checked; setTerms(Object.fromEntries(TERMS.map(t => [t.id, v]))); }} style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: 14, fontWeight: 700 }}>전체 동의</span>
                </label>
                {TERMS.map(term => (
                  <div key={term.id} style={{ border: '1px solid var(--border)', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', cursor: 'pointer', background: terms[term.id] ? 'rgba(0,200,150,0.04)' : 'transparent' }}>
                      <input type="checkbox" checked={!!terms[term.id]} onChange={e => setTerms(t => ({...t, [term.id]: e.target.checked}))} style={{ width: 15, height: 15, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, flex: 1 }}>[필수] {term.title}</span>
                      {terms[term.id] && <Check size={13} color="#00C896" />}
                    </label>
                    <div style={{ padding: '10px 14px', background: 'var(--bg-card2)', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{term.content}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '13px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>이전</button>
                <button onClick={handleStep2Next} style={{ flex: 2, padding: '13px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>다음</button>
              </div>
            </>
          )}

          {/* Step 3: 회원정보 입력 */}
          {step === 3 && (
            <>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{userType === 'advertiser' ? '담당자 이름' : '닉네임'} *</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)} placeholder={userType === 'advertiser' ? '홍길동' : '채널 닉네임'} />
                </div>

                {userType === 'advertiser' && (
                  <>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>회사명 *</label>
                      <input value={form.company} onChange={e => update('company', e.target.value)} placeholder="회사명을 입력해주세요" />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>업종 *</label>
                      <select value={industry} onChange={e => setIndustry(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: industry ? 'var(--text)' : 'var(--text-muted)', fontSize: 14, cursor: 'pointer' }}>
                        <option value="">업종을 선택해주세요</option>
                        {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>업무 이메일 * <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(이메일 인증 필요)</span></label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input type="email" value={bizEmail} onChange={e => { setBizEmail(e.target.value); setBizEmailVerified(false); setBizEmailSent(false); }} placeholder="업무 이메일 주소" style={{ flex: 1 }} disabled={bizEmailVerified} />
                        <button onClick={sendBizEmailVerification} disabled={bizEmailVerified || !bizEmail}
                          style={{ padding: '0 12px', background: bizEmailVerified ? '#00C896' : 'var(--bg-card2)', border: `1px solid ${bizEmailVerified ? '#00C896' : 'var(--border)'}`, color: bizEmailVerified ? 'white' : 'var(--text)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
                          {bizEmailVerified ? '✓ 인증완료' : bizEmailSent ? '인증중...' : '인증하기'}
                        </button>
                      </div>
                      {bizEmailSent && !bizEmailVerified && <p style={{ fontSize: 12, color: '#FFB800', marginTop: 4 }}>인증 이메일을 발송했어요. 이메일을 확인해주세요.</p>}
                      {bizEmailVerified && <p style={{ fontSize: 12, color: '#00C896', marginTop: 4 }}>✓ 이메일 인증이 완료되었습니다.</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>홈페이지</label>
                      <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://www.example.com" />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>사업자등록증 * <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(PDF, JPG, PNG)</span></label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--bg-card2)', border: '2px dashed var(--border)', borderRadius: 8, cursor: 'pointer' }}>
                        <Upload size={16} color="var(--text-muted)" />
                        <span style={{ fontSize: 13, color: bizFileName ? 'var(--text)' : 'var(--text-muted)' }}>{bizFileName || '파일을 선택해주세요'}</span>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => setBizFileName(e.target.files?.[0]?.name || '')} />
                      </label>
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>관심 카테고리 <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(선택)</span></label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {CATEGORIES.map(cat => (
                          <button key={cat} onClick={() => toggleCategory(cat)}
                            style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${selectedCategories.includes(cat) ? '#FF2D55' : 'var(--border)'}`, background: selectedCategories.includes(cat) ? 'rgba(255,45,85,0.1)' : 'transparent', color: selectedCategories.includes(cat) ? '#FF2D55' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontWeight: selectedCategories.includes(cat) ? 600 : 400 }}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>휴대폰번호</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr', gap: 8 }}>
                    <input value="010" readOnly style={{ textAlign: 'center', fontSize: 13 }} />
                    <input placeholder="0000" maxLength={4} style={{ fontSize: 13 }} onChange={e => update('phone', `010-${e.target.value}`)} />
                    <input placeholder="0000" maxLength={4} style={{ fontSize: 13 }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', marginBottom: 6 }}>
                    <input type="checkbox" checked={agreeEmail} onChange={e => setAgreeEmail(e.target.checked)} style={{ width: 14, height: 14 }} />
                    이메일 수신을 동의합니다.
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={agreeSms} onChange={e => setAgreeSms(e.target.checked)} style={{ width: 14, height: 14 }} />
                    SMS 수신을 동의합니다.
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: '13px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>이전</button>
                <button onClick={handleStep3Next} disabled={loading} style={{ flex: 2, padding: '13px', background: loading ? 'var(--border)' : 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? '처리 중...' : userType === 'influencer' ? '다음' : '가입 신청하기'}
                </button>
              </div>

              {userType === 'advertiser' && (
                <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.2)', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: '#FFB800', lineHeight: 1.6 }}>
                    ⚠️ 광고주 가입은 관리자 승인 후 이용 가능합니다.<br />
                    업무일 기준 5일 이내 승인 메일을 발송해드립니다.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Step 4: SNS 채널 인증 (인플루언서만) */}
          {step === 4 && userType === 'influencer' && (
            <>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                운영하는 SNS 채널을 등록해주세요.<br />
                <span style={{ fontSize: 12, color: '#FFB800' }}>* 최소 1개 이상 인증해야 합니다.</span>
              </p>
              {[
                { key: 'youtube', label: '유튜브', icon: '📺', placeholder: 'https://youtube.com/@채널명' },
                { key: 'instagram', label: '인스타그램', icon: '📸', placeholder: 'https://instagram.com/계정명' },
                { key: 'tiktok', label: '틱톡', icon: '🎵', placeholder: 'https://tiktok.com/@계정명' },
              ].map(sns => (
                <div key={sns.key} style={{ marginBottom: 12, padding: '14px', background: 'var(--bg-card2)', borderRadius: 10, border: `1px solid ${channelVerified[sns.key as keyof typeof channelVerified] ? '#00C896' : 'var(--border)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>{sns.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{sns.label}</span>
                    {channelVerified[sns.key as keyof typeof channelVerified] && (
                      <span style={{ fontSize: 11, background: 'rgba(0,200,150,0.15)', color: '#00C896', padding: '2px 8px', borderRadius: 20, fontWeight: 600, marginLeft: 'auto' }}>✓ 인증 완료</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={channelForm[sns.key as keyof typeof channelForm]}
                      onChange={e => setChannelForm(f => ({ ...f, [sns.key]: e.target.value }))}
                      placeholder={sns.placeholder} disabled={channelVerified[sns.key as keyof typeof channelVerified]}
                      style={{ flex: 1, fontSize: 12, padding: '8px 10px', height: 'auto', opacity: channelVerified[sns.key as keyof typeof channelVerified] ? 0.6 : 1 }} />
                    {!channelVerified[sns.key as keyof typeof channelVerified] && (
                      <button onClick={() => verifyChannel(sns.key as any)}
                        disabled={channelChecking[sns.key as keyof typeof channelChecking] || !channelForm[sns.key as keyof typeof channelForm]}
                        style={{ padding: '0 12px', background: channelForm[sns.key as keyof typeof channelForm] ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {channelChecking[sns.key as keyof typeof channelChecking] ? '확인중...' : '인증하기'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: '13px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>이전</button>
                <button onClick={handleSubmit} disabled={loading || !Object.values(channelVerified).some(Boolean)}
                  style={{ flex: 2, padding: '13px', background: Object.values(channelVerified).some(Boolean) ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: Object.values(channelVerified).some(Boolean) ? 'pointer' : 'not-allowed' }}>
                  {loading ? '처리 중...' : '가입 완료'}
                </button>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-muted)' }}>
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
