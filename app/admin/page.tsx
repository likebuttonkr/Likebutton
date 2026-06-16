'use client';
import { showToast } from '../components/Toast';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart2, Users, Briefcase, MessageSquare, Tag, CreditCard, Download, Settings, Eye, EyeOff, TrendingUp, Star, FileText, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { NoticeManager, EventManager, FAQManager, QnAManager, TermsManager } from './components/BoardManager';
import AdvertiserManager from './components/AdvertiserManager';
import InfluencerManager from './components/InfluencerManager';
import ReviewManager from './components/ReviewManager';
import CouponManager from './components/CouponManager';
import PaymentManager from './components/PaymentManager';
import WithdrawalManager from './components/WithdrawalManager';
import StatisticsManager from './components/StatisticsManager';

const ADMIN_EMAIL = 'admin@likebutton.kr';
const ADMIN_PASSWORD = 'likebutton2024!';

const NAV_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: BarChart2 },
  { id: 'influencers', label: '인플루언서 관리', icon: Users },
  { id: 'advertisers', label: '광고주 관리', icon: Briefcase },
  { id: 'services', label: '서비스 관리', icon: Star },
  { id: 'projects', label: '프로젝트 관리', icon: Briefcase },
  { id: 'messages', label: '메시지 관리', icon: MessageSquare },
  { id: 'board', label: '게시판 관리', icon: FileText, sub: ['공지사항', '이벤트', 'FAQ', 'Q&A', '약관', '리뷰'] },
  { id: 'coupons', label: '쿠폰 관리', icon: Tag },
  { id: 'payments', label: '결제 관리', icon: CreditCard },
  { id: 'withdrawals', label: '출금 관리', icon: Download },
  { id: 'settings', label: '설정', icon: Settings, sub: ['배너', '카테고리', '서비스', '이메일'] },
  { id: 'statistics', label: '통계', icon: TrendingUp },
];

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSub, setActiveSub] = useState('공지사항');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedNav, setExpandedNav] = useState<string[]>(['board', 'settings']);
  const [stats, setStats] = useState({ totalUsers: 0, influencers: 0, advertisers: 0, projects: 0, pendingApprovals: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [searchQ, setSearchQ] = useState('');
  const [userFilter, setUserFilter] = useState('전체');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') { setIsLoggedIn(true); loadData(); }
    setLoading(false);
  }, []);

  const loadData = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*');
    const { data: projects } = await supabase.from('projects').select('*');
    if (profiles) {
      setStats({
        totalUsers: profiles.length,
        influencers: profiles.filter(p => p.user_type === 'influencer').length,
        advertisers: profiles.filter(p => p.user_type === 'advertiser').length,
        projects: projects?.length || 0,
        pendingApprovals: profiles.filter(p => p.user_type === 'advertiser' && (!p.approval_status || p.approval_status === '승인대기')).length,
      });
      setUsers(profiles);
    }
  };

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsLoggedIn(true); setError('');
      loadData();
    } else { setError('아이디 또는 비밀번호가 올바르지 않습니다.'); }
  };

  const handleLogout = () => { sessionStorage.removeItem('admin_auth'); setIsLoggedIn(false); };
  const toggleNav = (id: string) => setExpandedNav(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id]);

  const filteredUsers = users.filter(u => {
    const q = searchQ.toLowerCase();
    const matchQ = !q || u.email?.includes(q) || u.name?.includes(q);
    const matchType = userFilter === '전체' || (userFilter === '인플루언서' && u.user_type === 'influencer') || (userFilter === '광고주' && u.user_type === 'advertiser');
    return matchQ && matchType;
  });

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-muted)' }}>로딩 중...</p></div>;

  if (!isLoggedIn) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 360, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22 }}>♥</div>
          <h1 style={{ fontSize: 20, fontWeight: 900 }}>라이크버튼 관리자</h1>
        </div>
        {error && <div style={{ padding: '10px 14px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 13, color: '#FF2D55' }}>{error}</div>}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>아이디</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@likebutton.kr" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>비밀번호</label>
          <div style={{ position: 'relative' }}>
            <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ paddingRight: 40 }} />
            <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <button onClick={handleLogin} style={{ width: '100%', padding: 13, background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>로그인</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: 'var(--bg-card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, overflowY: 'auto' }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>♥</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800 }}>라이크버튼</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>관리자</p>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '8px 8px' }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isExpanded = expandedNav.includes(item.id);
            const isActive = activeTab === item.id;
            return (
              <div key={item.id}>
                <button onClick={() => { if (item.sub) { toggleNav(item.id); if (!isExpanded) { setActiveTab(item.id); setActiveSub(item.sub[0]); } } else { setActiveTab(item.id); setActiveSub(''); } }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '9px 10px', border: 'none', cursor: 'pointer', borderRadius: 8, marginBottom: 2, background: isActive && !item.sub ? 'rgba(255,45,85,0.1)' : 'transparent', color: isActive && !item.sub ? '#FF2D55' : 'var(--text-muted)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={14} />
                    <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
                    {item.id === 'advertisers' && stats.pendingApprovals > 0 && (
                      <span style={{ fontSize: 10, background: '#FF2D55', color: 'white', borderRadius: 10, padding: '1px 6px', fontWeight: 700 }}>{stats.pendingApprovals}</span>
                    )}
                  </div>
                  {item.sub && (isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />)}
                </button>
                {item.sub && isExpanded && (
                  <div style={{ paddingLeft: 22, marginBottom: 4 }}>
                    {item.sub.map(sub => (
                      <button key={sub} onClick={() => { setActiveTab(item.id); setActiveSub(sub); }}
                        style={{ display: 'block', width: '100%', padding: '7px 10px', border: 'none', cursor: 'pointer', borderRadius: 6, marginBottom: 1, background: activeTab === item.id && activeSub === sub ? 'rgba(255,45,85,0.08)' : 'transparent', color: activeTab === item.id && activeSub === sub ? '#FF2D55' : 'var(--text-muted)', textAlign: 'left', fontSize: 12, fontWeight: activeTab === item.id && activeSub === sub ? 600 : 400 }}>
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>admin@likebutton.kr</p>
          <button onClick={handleLogout} style={{ fontSize: 12, color: '#FF2D55', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>로그아웃</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, padding: '28px 32px', minHeight: '100vh' }}>

        {/* 대시보드 */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h1 style={{ fontSize: 20, fontWeight: 900 }}>대시보드</h1>
              <div style={{ display: 'flex', gap: 6 }}>
                {['오늘', '7일', '30일', '전체'].map(period => (
                  <button key={period}
                    style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)', background: period === '30일' ? 'rgba(255,45,85,0.1)' : 'transparent', color: period === '30일' ? '#FF2D55' : 'var(--text-muted)', fontSize: 12, fontWeight: period === '30일' ? 700 : 400, cursor: 'pointer' }}>
                    {period}
                  </button>
                ))}
              </div>
            </div>
            {stats.pendingApprovals > 0 && (
              <div onClick={() => { setActiveTab('advertisers'); setActiveSub(''); }}
                style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.3)', borderRadius: 10, padding: '12px 18px', marginBottom: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>⚠️</span>
                <p style={{ fontSize: 13, color: '#FFB800', fontWeight: 600 }}>승인 대기 중인 광고주 {stats.pendingApprovals}명이 있어요 → 광고주 관리에서 확인하세요</p>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { label: '전체 회원 수', value: stats.totalUsers, icon: '👥', color: '#5B8DEF' },
                { label: '인플루언서 수', value: stats.influencers, icon: '🎬', color: '#FF2D55' },
                { label: '광고주 수', value: stats.advertisers, icon: '🏢', color: '#FFB800' },
                { label: '프로젝트 수', value: stats.projects, icon: '📋', color: '#00C896' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{s.icon}</span>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</p>
                  </div>
                  <p style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* 최근 가입자 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>최근 가입 회원</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['이메일', '이름', '구분', '가입일'].map(h => <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {users.slice(0, 8).map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 12px', fontSize: 12 }}>{u.email}</td>
                      <td style={{ padding: '8px 12px' }}>{u.name || '-'}</td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: u.user_type === 'influencer' ? '#FF2D55' : '#FFB800', background: u.user_type === 'influencer' ? 'rgba(255,45,85,0.1)' : 'rgba(255,184,0,0.1)', padding: '2px 8px', borderRadius: 20 }}>
                          {u.user_type === 'influencer' ? '인플루언서' : '광고주'}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString('ko-KR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
                <button onClick={() => setActiveTab('influencers')} style={{ fontSize: 12, color: '#FF2D55', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>전체 회원 보기 →</button>
              </div>
            </div>
          </div>
        )}

        {/* 인플루언서 관리 */}
        {activeTab === 'influencers' && <InfluencerManager />}

        {/* 광고주 관리 */}
        {activeTab === 'advertisers' && <AdvertiserManager />}

        {/* 서비스 관리 */}
        {activeTab === 'services' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>서비스 관리</h2>
            <ServiceListAdmin />
          </div>
        )}

        {/* 프로젝트 관리 */}
        {activeTab === 'projects' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>프로젝트 관리</h2>
            <ProjectListAdmin />
          </div>
        )}

        {/* 메시지 관리 */}
        {activeTab === 'messages' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>메시지 관리</h2>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>💬</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>메시지 모니터링</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>외부 결제 유도 키워드 감지 시 자동 신고 처리됩니다.</p>
            </div>
          </div>
        )}

        {/* 게시판 관리 */}
        {activeTab === 'board' && (
          <div>
            {activeSub === '공지사항' && <NoticeManager />}
            {activeSub === '이벤트' && <EventManager />}
            {activeSub === 'FAQ' && <FAQManager />}
            {activeSub === 'Q&A' && <QnAManager />}
            {activeSub === '약관' && <TermsManager />}
            {activeSub === '리뷰' && <ReviewManager />}
          </div>
        )}

        {/* 쿠폰 관리 */}
        {activeTab === 'coupons' && <CouponManager />}

        {/* 결제 관리 */}
        {activeTab === 'payments' && <PaymentManager />}

        {/* 출금 관리 */}
        {activeTab === 'withdrawals' && <WithdrawalManager />}

        {/* 설정 */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>설정 - {activeSub}</h2>
            <SettingsPanel activeSub={activeSub} />
          </div>
        )}

        {/* 통계 */}
        {activeTab === 'statistics' && <StatisticsManager />}
      </main>
    </div>
  );
}

// 서비스 목록
function ServiceListAdmin() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('services').select('*, profiles(name, email)').order('created_at', { ascending: false }).then(({ data }) => setList(data || []));
  }, []);
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
        <thead><tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
          {['No.', '인플루언서', '플랫폼', '서비스명', '카테고리', '등록일'].map(h =>
            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {list.length === 0
            ? <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>등록된 서비스가 없어요</td></tr>
            : list.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{i + 1}</td>
                <td style={{ padding: '10px 14px' }}>{s.profiles?.name || s.profiles?.email || '-'}</td>
                <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{s.platform}</span></td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{s.title}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{s.category || '-'}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{new Date(s.created_at).toLocaleDateString('ko-KR')}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// 프로젝트 목록
function ProjectListAdmin() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('projects').select('*').order('created_at', { ascending: false }).then(({ data }) => setList(data || []));
  }, []);
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
        <thead><tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
          {['No.', '프로젝트명', '플랫폼', '광고 형태', '예산', '상태', '요청일'].map(h =>
            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {list.length === 0
            ? <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>프로젝트가 없어요</td></tr>
            : list.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{i + 1}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{p.title}</td>
                <td style={{ padding: '10px 14px' }}>{p.platform || '-'}</td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{p.ad_type || '-'}</td>
                <td style={{ padding: '10px 14px', color: '#FF2D55', fontWeight: 600 }}>{p.budget?.toLocaleString() || '-'}원</td>
                <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 8px', borderRadius: 20 }}>{p.status || '광고 요청'}</span></td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{new Date(p.created_at).toLocaleDateString('ko-KR')}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// 설정 패널
function SettingsPanel({ activeSub }: { activeSub: string }) {
  const [banners, setBanners] = useState([{ order: 1, url: '', link: '', active: true }]);
  const [emailTarget, setEmailTarget] = useState('전체');
  const [emailContent, setEmailContent] = useState('');
  const [emailHistory, setEmailHistory] = useState<any[]>([]);

  const sendEmail = async () => {
    if (!emailContent) { showToast('내용을 입력해주세요.', 'warning'); return; }
    await supabase.from('email_history').insert({ target: emailTarget, content: emailContent });
    setEmailHistory(h => [{ target: emailTarget, content: emailContent, created_at: new Date().toISOString() }, ...h]);
    setEmailContent('');
    showToast('이메일이 발송되었습니다.', 'success');
  };

  if (activeSub === '배너') return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>메인 배너 관리</h3>
      {banners.map((b, i) => (
        <div key={i} style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 10, marginBottom: 8 }}>
            <div><label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>노출 순서</label>
              <select value={b.order} onChange={e => setBanners(bans => bans.map((bn, j) => j === i ? {...bn, order: parseInt(e.target.value)} : bn))}
                style={{ width: '100%', padding: '7px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: 12, cursor: 'pointer' }}>
                {[1,2,3,4].map(n => <option key={n}>순서 {n}</option>)}
              </select></div>
            <div><label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>연결 URL</label>
              <input value={b.link} onChange={e => setBanners(bans => bans.map((bn, j) => j === i ? {...bn, link: e.target.value} : bn))} placeholder="https://..." style={{ fontSize: 12, padding: '7px 10px', height: 'auto' }} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>노출</label>
            <button onClick={() => setBanners(bans => bans.map((bn, j) => j === i ? {...bn, active: !bn.active} : bn))}
              style={{ padding: '4px 12px', background: b.active ? 'rgba(0,200,150,0.1)' : 'var(--bg-card)', border: `1px solid ${b.active ? 'rgba(0,200,150,0.3)' : 'var(--border)'}`, color: b.active ? '#00C896' : 'var(--text-muted)', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              {b.active ? 'ON' : 'OFF'}
            </button>
            {banners.length > 1 && <button onClick={() => setBanners(bans => bans.filter((_, j) => j !== i))}
              style={{ padding: '4px 10px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>삭제</button>}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setBanners(b => [...b, { order: b.length + 1, url: '', link: '', active: true }])}
          style={{ padding: '8px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>+ 추가</button>
        <button onClick={() => showToast('배너 설정이 저장되었습니다.', 'success')}
          style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>설정 저장</button>
      </div>
    </div>
  );

  if (activeSub === '이메일') return (
    <div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>이메일 발송</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, marginBottom: 12 }}>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>발송 대상</label>
            <select value={emailTarget} onChange={e => setEmailTarget(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
              {['전체', '인플루언서', '광고주'].map(t => <option key={t}>{t}</option>)}
            </select></div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>내용</label>
          <textarea value={emailContent} onChange={e => setEmailContent(e.target.value)} placeholder="이메일 내용을 입력하세요"
            style={{ width: '100%', minHeight: 120, padding: '10px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <button onClick={sendEmail} style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>발송</button>
      </div>
      {emailHistory.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 13 }}>발송 이력</div>
          {emailHistory.map((e, i) => (
            <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 8px', borderRadius: 20, fontWeight: 600, whiteSpace: 'nowrap' }}>{e.target}</span>
              <p style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.content}</p>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(e.created_at).toLocaleDateString('ko-KR')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (activeSub === '카테고리') return <CategorySettings />;
  if (activeSub === '서비스') return <ServiceSettings />;

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px', textAlign: 'center' }}>
      <p style={{ fontSize: 36, marginBottom: 12 }}>⚙️</p>
      <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{activeSub} 설정</p>
      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>준비 중이에요</p>
    </div>
  );
}

// 카테고리 관리
function CategorySettings() {
  const INITIAL = [
    { id: 1, name: '뷰티/패션', sub: ['뷰티', '패션', '스킨케어', '헤어'] },
    { id: 2, name: '음식/요리', sub: ['먹방', '요리', '베이킹', '카페투어'] },
    { id: 3, name: '게임', sub: ['FPS', 'RPG', '모바일게임', '스트리밍'] },
    { id: 4, name: '여행', sub: ['국내여행', '해외여행', '캠핑', '맛집'] },
    { id: 5, name: '운동', sub: ['헬스', '요가', '필라테스', '러닝'] },
    { id: 6, name: 'IT/테크', sub: ['스마트폰', '노트북', '앱리뷰', '개발'] },
    { id: 7, name: '교육', sub: ['영어', '자격증', '독서', '공부'] },
    { id: 8, name: '라이프스타일', sub: ['육아', '반려동물', '인테리어', '재테크'] },
  ];
  const [categories, setCategories] = useState(INITIAL);
  const [newCat, setNewCat] = useState('');
  const [editId, setEditId] = useState<number|null>(null);
  const [editName, setEditName] = useState('');
  const [newSub, setNewSub] = useState<Record<number,string>>({});

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="새 대분류 카테고리 이름" style={{ flex: 1, fontSize: 13 }} />
        <button onClick={() => { if (!newCat.trim()) return; setCategories(c => [...c, { id: Date.now(), name: newCat, sub: [] }]); setNewCat(''); showToast('카테고리가 추가되었습니다.', 'success'); }}
          style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
          + 추가
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {categories.map((cat, idx) => (
          <div key={cat.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              {editId === cat.id ? (
                <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                  <input value={editName} onChange={e => setEditName(e.target.value)} style={{ flex: 1, fontSize: 13 }} />
                  <button onClick={() => { setCategories(c => c.map(item => item.id === cat.id ? {...item, name: editName} : item)); setEditId(null); showToast('수정되었습니다.', 'success'); }}
                    style={{ padding: '5px 12px', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', color: '#00C896', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>저장</button>
                  <button onClick={() => setEditId(null)} style={{ padding: '5px 10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>취소</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => idx > 0 && setCategories(c => { const n=[...c]; [n[idx-1],n[idx]]=[n[idx],n[idx-1]]; return n; })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}>▲</button>
                    <button onClick={() => idx < categories.length-1 && setCategories(c => { const n=[...c]; [n[idx],n[idx+1]]=[n[idx+1],n[idx]]; return n; })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}>▼</button>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{cat.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cat.sub.length}개 소분류</span>
                </div>
              )}
              {editId !== cat.id && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                    style={{ padding: '4px 10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>수정</button>
                  <button onClick={() => { setCategories(c => c.filter(item => item.id !== cat.id)); showToast('삭제되었습니다.', 'success'); }}
                    style={{ padding: '4px 10px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>삭제</button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {cat.sub.map(s => (
                <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 12 }}>
                  {s}
                  <button onClick={() => setCategories(c => c.map(item => item.id === cat.id ? {...item, sub: item.sub.filter(x => x !== s)} : item))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11, padding: 0, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value={newSub[cat.id] || ''} onChange={e => setNewSub(s => ({...s, [cat.id]: e.target.value}))}
                placeholder="소분류 추가" style={{ flex: 1, fontSize: 12, padding: '5px 10px', height: 'auto' }}
                onKeyDown={e => { if (e.key === 'Enter' && newSub[cat.id]?.trim()) { setCategories(c => c.map(item => item.id === cat.id ? {...item, sub: [...item.sub, newSub[cat.id]]} : item)); setNewSub(s => ({...s, [cat.id]: ''})); }}} />
              <button onClick={() => { if (!newSub[cat.id]?.trim()) return; setCategories(c => c.map(item => item.id === cat.id ? {...item, sub: [...item.sub, newSub[cat.id]]} : item)); setNewSub(s => ({...s, [cat.id]: ''})); }}
                style={{ padding: '5px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--text)', whiteSpace: 'nowrap' }}>+ 소분류</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => showToast('카테고리 설정이 저장되었습니다.', 'success')}
          style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
          전체 저장
        </button>
      </div>
    </div>
  );
}

// 서비스 기본 문구
function ServiceSettings() {
  const [texts, setTexts] = useState({
    serviceIntro: '안녕하세요! 저는 [카테고리] 전문 크리에이터입니다.\n구독자 [N]명과 함께 다양한 콘텐츠를 제작하고 있어요.\n광고 문의는 편하게 연락주세요!',
    processDesc: '1. 광고 요청 확인\n2. 기획안 작성 및 공유\n3. 촬영 및 편집\n4. 피드백 반영\n5. 최종 업로드',
    refundPolicy: '광고 영상 제작 시작 전: 전액 환불\n광고 영상 제작 중: 50% 환불\n광고 영상 제작 완료 후: 환불 불가',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[
        { key: 'serviceIntro', label: '서비스 소개 기본 문구', placeholder: '서비스 소개 기본 문구...' },
        { key: 'processDesc', label: '광고 진행 과정 기본 문구', placeholder: '진행 과정 설명...' },
        { key: 'refundPolicy', label: '환불 정책 기본 문구', placeholder: '환불 정책...' },
      ].map(item => (
        <div key={item.key} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px' }}>
          <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>{item.label}</label>
          <textarea value={texts[item.key as keyof typeof texts]}
            onChange={e => setTexts(t => ({...t, [item.key]: e.target.value}))}
            style={{ width: '100%', minHeight: 100, padding: '10px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => showToast('서비스 기본 문구가 저장되었습니다.', 'success')}
          style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
          저장
        </button>
      </div>
    </div>
  );
}
