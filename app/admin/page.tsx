'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { Users, Briefcase, DollarSign, TrendingUp, Bell, Settings, BarChart2, MessageSquare, Tag, CreditCard, Download, Shield, Eye, EyeOff } from 'lucide-react';

const ADMIN_EMAIL = 'admin@likebutton.kr';
const ADMIN_PASSWORD = 'likebutton2024!';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, influencers: 0, advertisers: 0, projects: 0 });
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin_auth');
    if (adminAuth === 'true') {
      setIsLoggedIn(true);
      loadStats();
    }
    setLoading(false);
  }, []);

  const loadStats = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*');
    const { data: projects } = await supabase.from('projects').select('*');
    if (profiles) {
      setStats({
        totalUsers: profiles.length,
        influencers: profiles.filter(p => p.user_type === 'influencer').length,
        advertisers: profiles.filter(p => p.user_type === 'advertiser').length,
        projects: projects?.length || 0,
      });
      setUsers(profiles);
    }
  };

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsLoggedIn(true);
      loadStats();
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

  if (!isLoggedIn) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Shield size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>관리자 로그인</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>라이크버튼 관리자 전용 페이지입니다</p>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          {error && <div style={{ padding: '12px 16px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#FF2D55' }}>{error}</div>}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>관리자 이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@likebutton.kr" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>비밀번호</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호 입력" style={{ paddingRight: 42 }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button onClick={handleLogin} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>로그인</button>
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
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>{NAV.find(n => n.id === activeTab)?.label}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button style={{ padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer' }}><Bell size={16} /></button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* 실제 DB 통계 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: '전체 회원', value: stats.totalUsers, icon: Users, color: '#FF2D55' },
                { label: '인플루언서', value: stats.influencers, icon: TrendingUp, color: '#FF6B35' },
                { label: '광고주', value: stats.advertisers, icon: Briefcase, color: '#FFB800' },
                { label: '프로젝트', value: stats.projects, icon: DollarSign, color: '#00C896' },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stat.label}</p>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} color={stat.color} />
                      </div>
                    </div>
                    <p style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>{stat.value}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>실제 DB 데이터</p>
                  </div>
                );
              })}
            </div>

            {/* 실제 회원 목록 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700 }}>가입 회원 목록</h2>
                <span style={{ fontSize: 11, background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>실제 DB</span>
              </div>
              {users.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 32, marginBottom: 12 }}>👤</p>
                  <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>아직 가입한 회원이 없어요</p>
                  <p style={{ fontSize: 13 }}>회원가입 후 여기서 확인할 수 있어요</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-card2)' }}>
                      {['이름', '이메일', '유형', '회사/채널', '가입일'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{user.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{user.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: user.user_type === 'influencer' ? '#FF2D55' : '#FFB800', background: user.user_type === 'influencer' ? 'rgba(255,45,85,0.1)' : 'rgba(255,184,0,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                            {user.user_type === 'influencer' ? '인플루언서' : '광고주'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{user.company || user.channel_name || '-'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{new Date(user.created_at).toLocaleDateString('ko-KR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* 결제/출금 준비중 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {['결제 관리', '출금 관리'].map(title => (
                <div key={title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '40px', textAlign: 'center' }}>
                  <p style={{ fontSize: 32, marginBottom: 12 }}>🚧</p>
                  <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{title} 준비중</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>실제 결제 시스템 연동 후 제공될 예정이에요</p>
                </div>
              ))}
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
