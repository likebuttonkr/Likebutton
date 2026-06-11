'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Briefcase, DollarSign, TrendingUp, Bell, Settings, ChevronRight, BarChart2, MessageSquare, Tag, CreditCard, Download, Shield, Eye, EyeOff } from 'lucide-react';

const ADMIN_EMAIL = 'admin@likebutton.kr';
const ADMIN_PASSWORD = 'likebutton2024!';

const STATS = [
  { label: '전체 회원', value: '3,842', change: '+124', color: '#FF2D55', icon: Users },
  { label: '진행중 프로젝트', value: '287', change: '+18', color: '#FFB800', icon: Briefcase },
  { label: '이번달 거래액', value: '4.2억', change: '+12%', color: '#00C896', icon: DollarSign },
  { label: '신규 가입', value: '43', change: '+8', color: '#FF6B35', icon: TrendingUp },
];

const RECENT_PROJECTS = [
  { id: 1, influencer: '워크맨', advertiser: '뷰티코리아', title: '신제품 런칭', amount: '5,000,000', status: '광고 진행', statusColor: '#00C896' },
  { id: 2, influencer: '보겸TV', advertiser: '푸드스타트업', title: '밀키트 PPL', amount: '3,000,000', status: '영상 피드백', statusColor: '#FFB800' },
  { id: 3, influencer: '헤이지니', advertiser: '패션브랜드X', title: '봄 컬렉션', amount: '2,500,000', status: '입금 대기', statusColor: '#FF6B35' },
  { id: 4, influencer: '꽈뚜룹', advertiser: '게임회사Y', title: '신작 게임 홍보', amount: '4,000,000', status: '광고 완료', statusColor: '#8888AA' },
  { id: 5, influencer: '조재원', advertiser: '건강기능식품Z', title: '다이어트 제품', amount: '1,800,000', status: '광고 요청', statusColor: '#FF2D55' },
];

const WITHDRAWALS = [
  { name: '워크맨', bank: '신한은행', account: '110-***-1234', amount: '3,200,000', status: '출금 신청' },
  { name: '헤이지니', bank: '국민은행', account: '123-***-5678', amount: '1,500,000', status: '출금 신청' },
  { name: '보겸TV', bank: '카카오뱅크', account: '333-***-9012', amount: '2,700,000', status: '출금 완료' },
];

const NAV = [
  { id: 'dashboard', label: '대시보드', icon: BarChart2 },
  { id: 'influencers', label: '인플루언서 관리', icon: Users },
  { id: 'advertisers', label: '광고주 관리', icon: Briefcase },
  { id: 'projects', label: '프로젝트 관리', icon: Briefcase },
  { id: 'messages', label: '메시지 관리', icon: MessageSquare },
  { id: 'coupons', label: '쿠폰 관리', icon: Tag },
  { id: 'payments', label: '결제 관리', icon: CreditCard },
  { id: 'withdrawals', label: '출금 관리', icon: Download },
  { id: 'settings', label: '설정', icon: Settings },
];

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin_auth');
    if (adminAuth === 'true') setIsLoggedIn(true);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsLoggedIn(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <p style={{ color: 'var(--text-muted)' }}>로딩 중...</p>
    </div>
  );

  // 로그인 화면
  if (!isLoggedIn) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>
            <Shield size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>관리자 로그인</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>라이크버튼 관리자 전용 페이지입니다</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#FF2D55' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>관리자 이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@likebutton.kr"
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>비밀번호</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호 입력" style={{ paddingRight: 42 }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button onClick={handleLogin}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            로그인
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>← 사이트로 돌아가기</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside style={{ width: 220, background: 'var(--secondary)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>♥</div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 14 }}>라이크버튼</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>관리자</p>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', border: 'none', cursor: 'pointer', borderRadius: 8, marginBottom: 2, background: activeTab === item.id ? 'rgba(255,45,85,0.12)' : 'transparent', color: activeTab === item.id ? '#FF2D55' : 'var(--text-muted)', textAlign: 'left', transition: 'all 0.2s' }}>
                <Icon size={15} />
                <span style={{ fontSize: 13, fontWeight: activeTab === item.id ? 700 : 400 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{ADMIN_EMAIL}</p>
          <button onClick={handleLogout} style={{ fontSize: 12, color: '#FF2D55', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>로그아웃</button>
        </div>
      </aside>

      <main style={{ marginLeft: 220, flex: 1, padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>
              {NAV.find(n => n.id === activeTab)?.label || '대시보드'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer' }}><Bell size={16} /></button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {STATS.map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stat.label}</p>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} color={stat.color} />
                      </div>
                    </div>
                    <p style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>{stat.value}</p>
                    <p style={{ fontSize: 12, color: '#00C896' }}>이번달 {stat.change}</p>
                  </div>
                );
              })}
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, marginBottom: 24, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700 }}>최근 프로젝트</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card2)' }}>
                    {['인플루언서', '광고주', '프로젝트명', '광고금액', '상태'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_PROJECTS.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{p.influencer}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{p.advertiser}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.title}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#FF2D55' }}>{parseInt(p.amount).toLocaleString()}원</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 11, fontWeight: 700, color: p.statusColor, background: `${p.statusColor}18`, padding: '3px 10px', borderRadius: 20 }}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700 }}>출금 신청 현황</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card2)' }}>
                    {['인플루언서', '은행', '계좌번호', '출금금액', '상태', '처리'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WITHDRAWALS.map((w, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{w.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{w.bank}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{w.account}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#FF2D55' }}>{parseInt(w.amount).toLocaleString()}원</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 11, fontWeight: 700, color: w.status === '출금 완료' ? '#8888AA' : '#FFB800', background: w.status === '출금 완료' ? '#8888AA18' : '#FFB80018', padding: '3px 10px', borderRadius: 20 }}>{w.status}</span></td>
                      <td style={{ padding: '12px 16px' }}>
                        {w.status === '출금 신청' && (
                          <button style={{ padding: '5px 12px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>출금 완료</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab !== 'dashboard' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '60px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>준비중이에요</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>다음 업데이트에서 추가될 예정이에요!</p>
          </div>
        )}
      </main>
    </div>
  );
}
