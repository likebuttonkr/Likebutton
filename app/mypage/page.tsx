'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { User, Briefcase, Star, Bell, Settings, Heart, CreditCard, Tag, DollarSign, ChevronRight, LogOut, Edit2, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', company: '', phone: '', channel_name: '' });
  const [notifSettings, setNotifSettings] = useState({ message: true, notice: true, ad_request: true, stage: true });
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const [emailAgree, setEmailAgree] = useState(false);
  const [smsAgree, setSmsAgree] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUser(session.user);
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => {
          setProfile(data);
          setEditForm({ name: data?.name || '', company: data?.company || '', phone: data?.phone || '', channel_name: data?.channel_name || '' });
          setLoading(false);
        });
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSaveProfile = async () => {
    const { error } = await supabase.from('profiles').update(editForm).eq('id', user.id);
    if (!error) { setProfile({ ...profile, ...editForm }); setEditMode(false); }
  };

  const isInfluencer = profile?.user_type === 'influencer';

  const INFLUENCER_MENUS = [
    { id: 'profile', label: '프로필', icon: User },
    { id: 'services', label: '서비스 관리', icon: Star },
    { id: 'projects', label: '프로젝트 관리', icon: Briefcase },
    { id: 'revenue', label: '수익 관리', icon: DollarSign },
    { id: 'notifications', label: '알림', icon: Bell },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  const ADVERTISER_MENUS = [
    { id: 'profile', label: '프로필', icon: User },
    { id: 'projects', label: '프로젝트 관리', icon: Briefcase },
    { id: 'payments', label: '결제 내역', icon: CreditCard },
    { id: 'coupons', label: '쿠폰', icon: Tag },
    { id: 'favorites', label: '관심 인플루언서', icon: Heart },
    { id: 'notifications', label: '알림', icon: Bell },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  const menus = isInfluencer ? INFLUENCER_MENUS : ADVERTISER_MENUS;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>로딩 중...</p>
    </div>
  );

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: isMobile ? 16 : 24, alignItems: 'start' }}>
        {/* Sidebar */}
        <aside style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', position: 'sticky', top: 88 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 22, fontWeight: 900, color: 'white' }}>
              {(profile?.name || user?.email || '?')[0].toUpperCase()}
            </div>
            <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{profile?.name || '이름 없음'}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{profile?.company || profile?.channel_name || user?.email}</p>
            <span style={{ fontSize: 11, fontWeight: 700, color: isInfluencer ? '#FF2D55' : '#FFB800', background: isInfluencer ? 'rgba(255,45,85,0.1)' : 'rgba(255,184,0,0.1)', padding: '2px 10px', borderRadius: 20 }}>
              {isInfluencer ? '인플루언서' : '광고주'}
            </span>
            {isInfluencer && (
              <p style={{ fontSize: 13, fontWeight: 700, marginTop: 10, color: '#00C896' }}>수익금 <span style={{ fontSize: 16 }}>0원</span></p>
            )}
          </div>
          <nav style={{ padding: '8px' }}>
            {menus.map(menu => {
              const Icon = menu.icon;
              return (
                <button key={menu.id} onClick={() => setActiveMenu(menu.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', border: 'none', cursor: 'pointer', borderRadius: 8, marginBottom: 2, background: activeMenu === menu.id ? 'rgba(255,45,85,0.1)' : 'transparent', color: activeMenu === menu.id ? '#FF2D55' : 'var(--text-muted)', textAlign: 'left', transition: 'all 0.15s' }}>
                  <Icon size={15} />
                  <span style={{ fontSize: 13, fontWeight: activeMenu === menu.id ? 700 : 400 }}>{menu.label}</span>
                </button>
              );
            })}
          </nav>
          <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 12px', border: 'none', cursor: 'pointer', borderRadius: 8, background: 'transparent', color: '#FF2D55', fontSize: 13 }}>
              <LogOut size={14} /> 로그아웃
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main>
          {/* 프로필 */}
          {activeMenu === 'profile' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>프로필</h2>
                {editMode
                  ? <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleSaveProfile} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><Check size={13} /> 저장</button>
                      <button onClick={() => setEditMode(false)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', background: 'var(--bg-card2)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}><X size={13} /> 취소</button>
                    </div>
                  : <button onClick={() => setEditMode(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'var(--bg-card2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><Edit2 size={13} /> 수정</button>
                }
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                {[
                  { label: '이메일', value: user?.email, field: null },
                  { label: isInfluencer ? '닉네임' : '담당자 이름', value: editForm.name, field: 'name' },
                  ...(!isInfluencer ? [{ label: '회사명', value: editForm.company, field: 'company' }] : []),
                  ...(isInfluencer ? [{ label: '채널명', value: editForm.channel_name, field: 'channel_name' }] : []),
                  { label: '휴대폰번호', value: editForm.phone, field: 'phone' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'center' }}>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</p>
                    {editMode && item.field
                      ? <input value={editForm[item.field as keyof typeof editForm]} onChange={e => setEditForm(f => ({ ...f, [item.field!]: e.target.value }))} style={{ fontSize: 14, padding: '8px 12px', height: 'auto' }} />
                      : <p style={{ fontSize: 14 }}>{item.value || '-'}</p>
                    }
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>이메일 수신</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={emailAgree} onChange={e => setEmailAgree(e.target.checked)} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>이메일 수신을 동의합니다.</span>
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>SMS 수신</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={smsAgree} onChange={e => setSmsAgree(e.target.checked)} />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>SMS 수신을 동의합니다.</span>
                  </label>
                </div>
              </div>
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <button style={{ fontSize: 13, color: '#FF2D55', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>회원탈퇴</button>
              </div>
            </div>
          )}

          {/* 서비스 관리 (인플루언서) */}
          {activeMenu === 'services' && isInfluencer && (
            <div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800 }}>서비스 관리</h2>
                  <button style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>+ 서비스 등록</button>
                </div>
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 40, marginBottom: 14 }}>📋</p>
                  <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>아직 등록된 서비스가 없어요</p>
                  <p style={{ fontSize: 13, marginBottom: 20 }}>광고 서비스를 등록하면 광고주들이 찾을 수 있어요</p>
                  <div style={{ background: 'var(--bg-card2)', borderRadius: 12, padding: '20px', textAlign: 'left', maxWidth: 400, margin: '0 auto' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>서비스 등록 방법</p>
                    {['카테고리 선택 (대/중/소분류)', '채널 정보 입력', '광고 상품 설정 (브랜디드/PPL/맞춤형)', '최소 광고비 설정', '서비스 소개 작성'].map((step, i) => (
                      <p key={i} style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,45,85,0.15)', color: '#FF2D55', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                        {step}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 프로젝트 관리 */}
          {activeMenu === 'projects' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>프로젝트 관리</h2>
              {/* Platform tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {['유튜브', '인스타그램', '틱톡'].map(t => (
                  <button key={t} style={{ padding: '7px 16px', borderRadius: 8, border: t === '유튜브' ? 'none' : '1px solid var(--border)', background: t === '유튜브' ? 'rgba(255,45,85,0.1)' : 'transparent', color: t === '유튜브' ? '#FF2D55' : 'var(--text-muted)', fontSize: 13, fontWeight: t === '유튜브' ? 700 : 400, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 40, marginBottom: 14 }}>📂</p>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>진행중인 프로젝트가 없어요</p>
                <p style={{ fontSize: 13, marginBottom: 20 }}>
                  {isInfluencer ? '광고주가 광고를 요청하면 여기서 확인할 수 있어요' : '인플루언서를 찾아 광고를 요청해보세요'}
                </p>
                {!isInfluencer && (
                  <Link href="/search" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>인플루언서 찾기</Link>
                )}
              </div>
            </div>
          )}

          {/* 수익 관리 (인플루언서) */}
          {activeMenu === 'revenue' && isInfluencer && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                  { label: '출금 가능 수익금', value: '0원', color: '#FF2D55' },
                  { label: '예상 수익금', value: '0원', color: '#FFB800' },
                  { label: '출금 완료 수익금', value: '0원', color: '#00C896' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</p>
                    <p style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {['수익 내역', '출금 내역', '월별 수수료 세금계산서'].map((t, i) => (
                    <button key={t} style={{ padding: '7px 14px', borderRadius: 8, border: i === 0 ? 'none' : '1px solid var(--border)', background: i === 0 ? 'rgba(255,45,85,0.1)' : 'transparent', color: i === 0 ? '#FF2D55' : 'var(--text-muted)', fontSize: 12, fontWeight: i === 0 ? 700 : 400, cursor: 'pointer' }}>{t}</button>
                  ))}
                </div>
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>💰</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>아직 수익 내역이 없어요</p>
                  <p style={{ fontSize: 13, marginTop: 6 }}>광고 진행 후 수익이 발생하면 여기서 확인할 수 있어요</p>
                </div>
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>출금 계좌 정보</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 10 }}>
                    {['은행 선택', '계좌번호', '예금주명'].map(p => <input key={p} placeholder={p} style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} />)}
                  </div>
                  <button style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>출금 신청</button>
                </div>
              </div>
            </div>
          )}

          {/* 결제 내역 (광고주) */}
          {activeMenu === 'payments' && !isInfluencer && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>결제 내역</h2>
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 40, marginBottom: 14 }}>🧾</p>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>결제 내역이 없어요</p>
                <p style={{ fontSize: 13 }}>광고 결제 후 내역이 여기에 표시돼요</p>
              </div>
            </div>
          )}

          {/* 쿠폰 (광고주) */}
          {activeMenu === 'coupons' && !isInfluencer && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>쿠폰</h2>
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 40, marginBottom: 14 }}>🎟️</p>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>보유한 쿠폰이 없어요</p>
                <p style={{ fontSize: 13 }}>이벤트나 프로모션을 통해 쿠폰을 받을 수 있어요</p>
                <Link href="/cs" style={{ display: 'inline-block', marginTop: 16, padding: '8px 20px', background: 'rgba(255,45,85,0.1)', color: '#FF2D55', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>이벤트 확인하기</Link>
              </div>
            </div>
          )}

          {/* 관심 인플루언서 (광고주) */}
          {activeMenu === 'favorites' && !isInfluencer && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>관심 인플루언서</h2>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {['유튜브', '인스타그램', '틱톡'].map((t, i) => (
                  <button key={t} style={{ padding: '7px 16px', borderRadius: 8, border: i === 0 ? 'none' : '1px solid var(--border)', background: i === 0 ? 'rgba(255,45,85,0.1)' : 'transparent', color: i === 0 ? '#FF2D55' : 'var(--text-muted)', fontSize: 13, fontWeight: i === 0 ? 700 : 400, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 40, marginBottom: 14 }}>❤️</p>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>관심 인플루언서가 없어요</p>
                <p style={{ fontSize: 13, marginBottom: 20 }}>인플루언서 상세 페이지에서 하트를 눌러 저장하세요</p>
                <Link href="/search" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>인플루언서 찾기</Link>
              </div>
            </div>
          )}

          {/* 알림 */}
          {activeMenu === 'notifications' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>알림</h2>
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 40, marginBottom: 14 }}>🔔</p>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>새 알림이 없어요</p>
                <p style={{ fontSize: 13 }}>새로운 알림이 오면 여기서 확인할 수 있어요</p>
              </div>
            </div>
          )}

          {/* 설정 */}
          {activeMenu === 'settings' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>설정</h2>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>알림 전체 설정</p>
                  <button onClick={() => { const all = Object.values(notifSettings).every(Boolean); setNotifSettings({ message: !all, notice: !all, ad_request: !all, stage: !all }); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: Object.values(notifSettings).every(Boolean) ? '#FF2D55' : 'var(--text-muted)' }}>
                    {Object.values(notifSettings).every(Boolean) ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>
                {[
                  { key: 'message', label: '메시지 알림', desc: '메시지가 있을 때 알림으로 받을 수 있습니다.' },
                  { key: 'notice', label: '공지/이벤트 알림', desc: '공지/이벤트를 알림으로 받을 수 있습니다.' },
                  { key: 'ad_request', label: isInfluencer ? '광고 요청 알림' : '안전결제 요청 알림', desc: isInfluencer ? '광고 요청이 있을 때 알림으로 받을 수 있습니다.' : '안전결제 요청이 있을 때 알림으로 받을 수 있습니다.' },
                  { key: 'stage', label: isInfluencer ? '단계 확정 알림' : '단계 저장 알림', desc: isInfluencer ? '광고주가 프로젝트 단계 확정 시 알림으로 받을 수 있습니다.' : '인플루언서가 프로젝트 단계별 저장 시 알림으로 받을 수 있습니다.' },
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</p>
                      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                        {['이메일', 'SMS'].map(ch => (
                          <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <input type="checkbox" /> {ch}
                          </label>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setNotifSettings(s => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: notifSettings[item.key as keyof typeof notifSettings] ? '#FF2D55' : 'var(--text-muted)' }}>
                      {notifSettings[item.key as keyof typeof notifSettings] ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
