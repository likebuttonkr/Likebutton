'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import { Check } from 'lucide-react';

function SignupContent() {
  const params = useSearchParams();
  const [userType, setUserType] = useState<'advertiser' | 'influencer'>(
    (params.get('type') as any) || 'advertiser'
  );
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', password: '', name: '', company: '', phone: '' });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>회원가입</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>어떤 유형으로 가입하시겠어요?</p>
        </div>

        {/* Type select */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          {[
            { type: 'advertiser', label: '광고주', desc: '인플루언서를 찾는\n브랜드·마케터', icon: '🏢' },
            { type: 'influencer', label: '인플루언서', desc: '광고를 진행할\n크리에이터·인플루언서', icon: '🎬' },
          ].map(opt => (
            <button key={opt.type} onClick={() => setUserType(opt.type as any)}
              style={{ padding: '20px 16px', borderRadius: 12, border: `2px solid ${userType === opt.type ? '#FF2D55' : 'var(--border)'}`, background: userType === opt.type ? 'rgba(255,45,85,0.08)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{opt.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: userType === opt.type ? '#FF2D55' : 'var(--text)' }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{opt.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>이메일 *</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="example@email.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>비밀번호 *</label>
            <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="8자 이상 입력" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{userType === 'advertiser' ? '담당자 이름' : '닉네임'} *</label>
            <input value={form.name} onChange={e => update('name', e.target.value)} placeholder={userType === 'advertiser' ? '홍길동' : '채널 닉네임'} />
          </div>
          {userType === 'advertiser' && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>회사명 *</label>
              <input value={form.company} onChange={e => update('company', e.target.value)} placeholder="회사명을 입력하세요" />
            </div>
          )}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>휴대폰 번호</label>
            <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="010-0000-0000" />
          </div>

          <div style={{ padding: '14px', background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 8, marginBottom: 20, display: 'flex', gap: 10 }}>
            <Check size={16} color="#00C896" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>가입 시 <Link href="/" style={{ color: '#FF2D55', textDecoration: 'none' }}>서비스 이용약관</Link> 및 <Link href="/" style={{ color: '#FF2D55', textDecoration: 'none' }}>개인정보 취급방침</Link>에 동의하게 됩니다.</p>
          </div>

          <button style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            {userType === 'advertiser' ? '광고주로 가입하기' : '인플루언서로 가입하기'}
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
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
