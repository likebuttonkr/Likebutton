'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { BarChart2, Users, Briefcase, MessageSquare, Tag, CreditCard, Download, Settings, Shield, Eye, EyeOff, Bell, TrendingUp, DollarSign, Star, FileText, ChevronDown, ChevronRight, Search, ToggleLeft, ToggleRight } from 'lucide-react';

const ADMIN_EMAIL = 'admin@likebutton.kr';
const ADMIN_PASSWORD = 'likebutton2024!';

const NAV_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: BarChart2 },
  { id: 'influencers', label: '인플루언서 관리', icon: Users },
  { id: 'advertisers', label: '광고주 관리', icon: Briefcase },
  { id: 'services', label: '서비스 관리', icon: Star },
  { id: 'projects', label: '프로젝트 관리', icon: Briefcase },
  { id: 'messages', label: '메시지 관리', icon: MessageSquare },
  {
    id: 'board', label: '게시판 관리', icon: FileText,
    sub: ['공지사항', '이벤트', 'FAQ', 'Q&A', '약관', '리뷰'],
  },
  { id: 'coupons', label: '쿠폰 관리', icon: Tag },
  { id: 'payments', label: '결제 관리', icon: CreditCard },
  { id: 'withdrawals', label: '출금 관리', icon: Download },
  {
    id: 'settings', label: '설정', icon: Settings,
    sub: ['배너', '카테고리', '서비스', '이메일'],
  },
  { id: 'statistics', label: '통계', icon: TrendingUp },
];

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSub, setActiveSub] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedNav, setExpandedNav] = useState<string[]>(['board', 'settings']);
  const [stats, setStats] = useState({ totalUsers: 0, influencers: 0, advertisers: 0, projects: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') { setIsLoggedIn(true); loadData(); }
    setLoading(false);
  }, []);

  const loadData = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*');
    const { data: projects } = await supabase.from('projects').select('*');
    if (profiles) {
      setStats({ totalUsers: profiles.length, influencers: profiles.filter(p => p.user_type === 'influencer').length, advertisers: profiles.filter(p => p.user_type === 'advertiser').length, projects: projects?.length || 0 });
      setUsers(profiles);
    }
  };

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsLoggedIn(true);
      loadData();
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleLogout = () => { sessionStorage.removeItem('admin_auth'); setIsLoggedIn(false); };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-muted)' }}>로딩 중...</p></div>;

  if (!isLoggedIn) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Shield size={28} color="white" /></div>
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
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
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

  const filteredUsers = users.filter(u => !searchQ || u.name?.includes(searchQ) || u.email?.includes(searchQ));
  const currentLabel = NAV_ITEMS.find(n => n.id === activeTab)?.label || activeSub;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: 'var(--secondary)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, overflowY: 'auto' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>♥</div>
          <div><p style={{ fontWeight: 800, fontSize: 14 }}>라이크버튼</p><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>관리자</p></div>
        </div>
        <nav style={{ flex: 1, padding: '8px' }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasSubActive = item.sub && activeSub && item.sub.some(s => s === activeSub);
            const isExpanded = expandedNav.includes(item.id);
            return (
              <div key={item.id}>
                <button onClick={() => {
                  if (item.sub) { setExpandedNav(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id]); }
                  else { setActiveTab(item.id); setActiveSub(''); }
                }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 10px', border: 'none', cursor: 'pointer', borderRadius: 7, marginBottom: 1, background: (isActive || hasSubActive) ? 'rgba(255,45,85,0.12)' : 'transparent', color: (isActive || hasSubActive) ? '#FF2D55' : 'var(--text-muted)', textAlign: 'left', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={14} />
                    <span style={{ fontSize: 13, fontWeight: (isActive || hasSubActive) ? 700 : 400 }}>{item.label}</span>
                  </span>
                  {item.sub && (isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />)}
                </button>
                {item.sub && isExpanded && item.sub.map(sub => (
                  <button key={sub} onClick={() => { setActiveTab(item.id); setActiveSub(sub); }}
                    style={{ display: 'block', width: '100%', padding: '7px 10px 7px 30px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12, borderRadius: 7, marginBottom: 1, background: activeSub === sub ? 'rgba(255,45,85,0.08)' : 'transparent', color: activeSub === sub ? '#FF2D55' : 'var(--text-muted)', fontWeight: activeSub === sub ? 600 : 400 }}>
                    {sub}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{ADMIN_EMAIL}</p>
          <button onClick={handleLogout} style={{ fontSize: 12, color: '#FF2D55', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>로그아웃</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 2 }}>{currentLabel}</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button style={{ padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer' }}><Bell size={16} /></button>
        </div>

        {/* 대시보드 */}
        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
              {[
                { label: '전체 회원', value: stats.totalUsers, icon: Users, color: '#FF2D55' },
                { label: '인플루언서', value: stats.influencers, icon: TrendingUp, color: '#FF6B35' },
                { label: '광고주', value: stats.advertisers, icon: Briefcase, color: '#FFB800' },
                { label: '프로젝트', value: stats.projects, icon: DollarSign, color: '#00C896' },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</p>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={16} color={s.color} /></div>
                    </div>
                    <p style={{ fontSize: 28, fontWeight: 900 }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>실제 DB 데이터</p>
                  </div>
                );
              })}
            </div>
            {/* User table */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 14, fontWeight: 700 }}>가입 회원 목록</h2>
                <span style={{ fontSize: 11, background: 'rgba(0,200,150,0.1)', color: '#00C896', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>실제 DB</span>
              </div>
              {users.length === 0
                ? <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: 32, marginBottom: 10 }}>👤</p>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>아직 가입한 회원이 없어요</p>
                  </div>
                : <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: 'var(--bg-card2)' }}>
                      {['이름', '이메일', '유형', '회사/채널', '가입일'].map(h => <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}>
                          <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600 }}>{u.name}</td>
                          <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</td>
                          <td style={{ padding: '11px 14px' }}><span style={{ fontSize: 11, fontWeight: 700, color: u.user_type === 'influencer' ? '#FF2D55' : '#FFB800', background: u.user_type === 'influencer' ? 'rgba(255,45,85,0.1)' : 'rgba(255,184,0,0.1)', padding: '2px 8px', borderRadius: 20 }}>{u.user_type === 'influencer' ? '인플루언서' : '광고주'}</span></td>
                          <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--text-muted)' }}>{u.company || u.channel_name || '-'}</td>
                          <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString('ko-KR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {['결제 관리', '출금 관리'].map(t => (
                <div key={t} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '32px', textAlign: 'center' }}>
                  <p style={{ fontSize: 28, marginBottom: 10 }}>🚧</p>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{t} 준비중</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>실제 결제 시스템 연동 후 제공돼요</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 인플루언서/광고주 관리 */}
        {(activeTab === 'influencers' || activeTab === 'advertisers') && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="이름, 이메일로 검색" style={{ paddingLeft: 32, fontSize: 13, height: 36 }} />
              </div>
            </div>
            {filteredUsers.filter(u => activeTab === 'influencers' ? u.user_type === 'influencer' : u.user_type === 'advertiser').length === 0
              ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 32, marginBottom: 10 }}>👤</p>
                  <p style={{ fontSize: 14 }}>해당 회원이 없어요</p>
                </div>
              : <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: 'var(--bg-card2)' }}>
                    {['No', '이름', '이메일', '회사/채널', '가입일', '상태'].map(h => <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {filteredUsers.filter(u => activeTab === 'influencers' ? u.user_type === 'influencer' : u.user_type === 'advertiser').map((u, i) => (
                      <tr key={u.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</td>
                        <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--text-muted)' }}>{u.company || u.channel_name || '-'}</td>
                        <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString('ko-KR')}</td>
                        <td style={{ padding: '11px 14px' }}><span style={{ fontSize: 11, fontWeight: 700, color: '#00C896', background: 'rgba(0,200,150,0.1)', padding: '2px 8px', borderRadius: 20 }}>정상</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* 게시판 관리 */}
        {activeTab === 'board' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{activeSub || '게시판 관리'}</h2>
            {!activeSub && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {['공지사항', '이벤트', 'FAQ', 'Q&A', '약관', '리뷰'].map(sub => (
                  <button key={sub} onClick={() => setActiveSub(sub)}
                    style={{ padding: '20px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                    {sub === '공지사항' ? '📢' : sub === '이벤트' ? '🎉' : sub === 'FAQ' ? '❓' : sub === 'Q&A' ? '💬' : sub === '약관' ? '📄' : '⭐'} {sub}
                  </button>
                ))}
              </div>
            )}
            {activeSub && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <button onClick={() => setActiveSub('')} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>← 목록으로</button>
                  <button style={{ padding: '7px 14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ {activeSub} 등록</button>
                </div>
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 32, marginBottom: 10 }}>📋</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{activeSub} 관리</p>
                  <p style={{ fontSize: 12, marginTop: 6 }}>등록된 {activeSub}이 없어요</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 쿠폰 관리 */}
        {activeTab === 'coupons' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>쿠폰 등록</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: 'var(--text-muted)' }}>대상</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {['전체', '구분', '조건'].map(t => <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer' }}><input type="radio" name="target" value={t} /> {t}</label>)}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: 'var(--text-muted)' }}>쿠폰명</label>
                    <input placeholder="쿠폰명 입력" style={{ fontSize: 13, height: 38 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: 'var(--text-muted)' }}>할인 종류</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {['정액식', '정률식'].map(t => <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer' }}><input type="radio" name="discount" value={t} /> {t}</label>)}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: 'var(--text-muted)' }}>할인금액</label>
                    <input placeholder="금액 입력" type="number" style={{ fontSize: 13, height: 38 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: 'var(--text-muted)' }}>유효기간</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="date" style={{ fontSize: 13, height: 38 }} />
                      <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>~</span>
                      <input type="date" style={{ fontSize: 13, height: 38 }} />
                    </div>
                  </div>
                  <button style={{ padding: '10px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>등록</button>
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>쿠폰 목록</h3>
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 32, marginBottom: 10 }}>🎟️</p>
                  <p style={{ fontSize: 14 }}>등록된 쿠폰이 없어요</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 결제/출금 관리 */}
        {(activeTab === 'payments' || activeTab === 'withdrawals') && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '60px', textAlign: 'center' }}>
            <p style={{ fontSize: 40, marginBottom: 14 }}>🚧</p>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{activeTab === 'payments' ? '결제 관리' : '출금 관리'} 준비중</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>실제 결제/출금 시스템 연동 후 제공될 예정이에요</p>
          </div>
        )}

        {/* 설정 */}
        {activeTab === 'settings' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{activeSub ? `설정 - ${activeSub}` : '설정'}</h2>
            {!activeSub && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {['배너', '카테고리', '서비스', '이메일'].map(sub => (
                  <button key={sub} onClick={() => setActiveSub(sub)}
                    style={{ padding: '20px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                    {sub === '배너' ? '🖼️' : sub === '카테고리' ? '📂' : sub === '서비스' ? '⚙️' : '📧'} {sub}
                  </button>
                ))}
              </div>
            )}
            {activeSub && (
              <div>
                <button onClick={() => setActiveSub('')} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>← 목록으로</button>
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 32, marginBottom: 10 }}>⚙️</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{activeSub} 설정</p>
                  <p style={{ fontSize: 12, marginTop: 6 }}>준비중이에요</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 통계 */}
        {activeTab === 'statistics' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <select style={{ padding: '8px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text)', cursor: 'pointer' }}>
                <option>전체 회원 수</option>
                <option>인플루언서 정상 수</option>
                <option>광고주 정상 수</option>
                <option>전체 프로젝트 수</option>
                <option>전체 프로젝트 금액</option>
                <option>출금 신청 금액</option>
                <option>출금 완료 금액</option>
                <option>평균 평점</option>
                <option>리뷰 수</option>
              </select>
              <input type="date" style={{ fontSize: 13, height: 38 }} defaultValue="2024-01-01" />
              <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: 13 }}>~</span>
              <input type="date" style={{ fontSize: 13, height: 38 }} defaultValue="2024-12-31" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { label: '전체 회원 수', value: stats.totalUsers },
                { label: '인플루언서 수', value: stats.influencers },
                { label: '광고주 수', value: stats.advertisers },
                { label: '프로젝트 수', value: stats.projects },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</p>
                  <p style={{ fontSize: 26, fontWeight: 900, color: '#FF2D55' }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-card2)', borderRadius: 10, color: 'var(--text-muted)' }}>
              <p style={{ fontSize: 14 }}>📊 통계 차트는 데이터가 쌓이면 표시됩니다</p>
            </div>
          </div>
        )}

        {/* 나머지 메뉴 */}
        {!['dashboard', 'influencers', 'advertisers', 'board', 'coupons', 'payments', 'withdrawals', 'settings', 'statistics'].includes(activeTab) && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '60px', textAlign: 'center' }}>
            <p style={{ fontSize: 40, marginBottom: 14 }}>🚧</p>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>준비중이에요</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>다음 업데이트에서 추가될 예정이에요</p>
          </div>
        )}
      </main>
    </div>
  );
}
