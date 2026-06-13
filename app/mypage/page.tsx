'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { User, Briefcase, Star, Bell, Settings, Heart, CreditCard, Tag, DollarSign, LogOut, Edit2, Check, X, ToggleLeft, ToggleRight, Plus, Trash2, ExternalLink } from 'lucide-react';

const CATEGORIES = ['뷰티/패션','음식/요리','게임','여행','운동/스포츠','엔터테인먼트','IT/테크','교육','라이프스타일','경제/비즈니스'];

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', company: '', phone: '', channel_name: '' });
  const [notifSettings, setNotifSettings] = useState({ message: true, notice: true, ad_request: true, stage: true });
  const [emailAgree, setEmailAgree] = useState(false);
  const [smsAgree, setSmsAgree] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // 서비스 관리
  const [services, setServices] = useState<any[]>([]);
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', category: '', channel_name: '', channel_url: '', subscriber_count: '', price_branded: '', price_ppl: '', price_custom: '협의', platform: 'youtube' });
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);

  // 관심 인플루언서
  const [favorites, setFavorites] = useState<any[]>([]);

  // Q&A
  const [qnaList, setQnaList] = useState<any[]>([]);
  const [qnaForm, setQnaForm] = useState({ category: '건의사항', title: '', content: '' });
  const [showQnaForm, setShowQnaForm] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUser(session.user);
      supabase.from('profiles').select('*').eq('id', session.user.id).single()
        .then(({ data }) => {
          setProfile(data);
          setEditForm({ name: data?.name || '', company: data?.company || '', phone: data?.phone || '', channel_name: data?.channel_name || '' });
          setAvatarUrl(data?.avatar_url || '');
          setLoading(false);
          if (data?.user_type === 'influencer') loadServices(session.user.id);
          else { loadFavorites(session.user.id); loadQna(session.user.id); }
        });
    });
  }, []);

  const loadServices = async (uid: string) => {
    const { data } = await supabase.from('services').select('*').eq('influencer_id', uid).order('created_at', { ascending: false });
    setServices(data || []);
  };

  const loadFavorites = async (uid: string) => {
    const { data } = await supabase.from('favorites').select('*').eq('advertiser_id', uid).order('created_at', { ascending: false });
    setFavorites(data || []);
  };

  const loadQna = async (uid: string) => {
    const { data } = await supabase.from('qna').select('*').eq('user_id', uid).order('created_at', { ascending: false });
    setQnaList(data || []);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  const handlePasswordChange = async () => {
    setPwError('');
    if (!pwForm.next || pwForm.next.length < 4) { setPwError('4~8자로 영문, 숫자를 모두 조합하여 구성해주세요.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('변경 비밀번호와 일치하지 않습니다.'); return; }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    setPwLoading(false);
    if (error) { setPwError('현재 비밀번호가 다릅니다.'); return; }
    alert('비밀번호가 변경되었습니다.');
    setShowPasswordModal(false);
    setPwForm({ current: '', next: '', confirm: '' });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    // 파일을 base64로 변환해서 미리보기
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarUrl(dataUrl);
      // Supabase에 avatar_url 업데이트
      await supabase.from('profiles').update({ avatar_url: dataUrl }).eq('id', user.id);
      setUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    const { error } = await supabase.from('profiles').update(editForm).eq('id', user.id);
    if (!error) { setProfile({ ...profile, ...editForm }); setEditMode(false); }
  };

  const handleAddService = async () => {
    if (!serviceForm.title || !serviceForm.category) { alert('서비스명과 카테고리를 입력해주세요.'); return; }
    setServiceLoading(true);
    const { error } = await supabase.from('services').insert({ ...serviceForm, influencer_id: user.id, price_branded: parseInt(serviceForm.price_branded) || 0, price_ppl: parseInt(serviceForm.price_ppl) || 0 });
    if (!error) { await loadServices(user.id); setShowServiceForm(false); setServiceForm({ title: '', description: '', category: '', channel_name: '', channel_url: '', subscriber_count: '', price_branded: '', price_ppl: '', price_custom: '협의', platform: 'youtube' }); }
    setServiceLoading(false);
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('서비스를 삭제하시겠어요?')) return;
    await supabase.from('services').delete().eq('id', id);
    await loadServices(user.id);
  };

  const handleDeleteFavorite = async (id: number) => {
    await supabase.from('favorites').delete().eq('id', id);
    await loadFavorites(user.id);
  };

  const handleAddQna = async () => {
    if (!qnaForm.title || !qnaForm.content) { alert('제목과 내용을 입력해주세요.'); return; }
    const { error } = await supabase.from('qna').insert({ ...qnaForm, user_id: user.id });
    if (!error) { await loadQna(user.id); setShowQnaForm(false); setQnaForm({ category: '건의사항', title: '', content: '' }); }
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
    { id: 'qna', label: 'Q&A', icon: Bell },
    { id: 'notifications', label: '알림', icon: Bell },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  const menus = isInfluencer ? INFLUENCER_MENUS : ADVERTISER_MENUS;

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-muted)' }}>로딩 중...</p></div>;

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: isMobile ? 16 : 24, alignItems: 'start' }}>
        {/* Sidebar */}
        <aside style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', position: isMobile ? 'static' : 'sticky', top: 88 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 22, fontWeight: 900, color: 'white' }}>
              {(profile?.name || user?.email || '?')[0].toUpperCase()}
            </div>
            <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{profile?.name || '이름 없음'}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{profile?.company || profile?.channel_name || user?.email}</p>
            <span style={{ fontSize: 11, fontWeight: 700, color: isInfluencer ? '#FF2D55' : '#FFB800', background: isInfluencer ? 'rgba(255,45,85,0.1)' : 'rgba(255,184,0,0.1)', padding: '2px 10px', borderRadius: 20 }}>
              {isInfluencer ? '인플루언서' : '광고주'}
            </span>
          </div>
          <nav style={{ padding: '8px' }}>
            {menus.map(menu => {
              const Icon = menu.icon;
              return (
                <button key={menu.id} onClick={() => setActiveMenu(menu.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', border: 'none', cursor: 'pointer', borderRadius: 8, marginBottom: 2, background: activeMenu === menu.id ? 'rgba(255,45,85,0.1)' : 'transparent', color: activeMenu === menu.id ? '#FF2D55' : 'var(--text-muted)', textAlign: 'left' }}>
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

        {/* Main */}
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

              {/* 프로필 이미지 업로드 */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>프로필 이미지</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--border)' }}>
                      {avatarUrl
                        ? <img src={avatarUrl} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: 26, fontWeight: 900, color: 'white' }}>{(profile?.name || user?.email || '?')[0].toUpperCase()}</span>
                      }
                    </div>
                    {uploadingAvatar && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 10, color: 'white' }}>업로드중</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                      📷 이미지 변경
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                    </label>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>JPG, PNG, GIF (최대 5MB)</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                {/* 아이디 */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>아이디</p>
                  <p style={{ fontSize: 14 }}>{user?.email}</p>
                </div>

                {/* 비밀번호 */}
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>비밀번호</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, letterSpacing: 3, color: 'var(--text-muted)' }}>●●●●●●●●</span>
                    <button onClick={() => setShowPasswordModal(true)}
                      style={{ padding: '5px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      변경
                    </button>
                  </div>
                </div>

                {[
                  { label: isInfluencer ? '닉네임' : '담당자 이름', value: editForm.name, field: 'name' },
                  ...(!isInfluencer ? [{ label: '회사명', value: editForm.company, field: 'company' }] : []),
                  ...(isInfluencer ? [{ label: '채널명', value: editForm.channel_name, field: 'channel_name' }] : []),
                  { label: '휴대폰번호', value: editForm.phone, field: 'phone' },
                ].map((item: any) => (
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

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={{ fontSize: 13, color: '#FF2D55', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => { if (confirm('정말 탈퇴하시겠어요? 모든 데이터가 삭제됩니다.')) alert('회원탈퇴가 처리되었습니다.'); }}>
                  회원탈퇴
                </button>
                {editMode && (
                  <button onClick={handleSaveProfile} style={{ padding: '9px 24px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                    수정 완료
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 비밀번호 변경 모달 */}
          {showPasswordModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px', width: '100%', maxWidth: 400 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800 }}>비밀번호 변경</h3>
                  <button onClick={() => { setShowPasswordModal(false); setPwError(''); setPwForm({ current: '', next: '', confirm: '' }); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 20 }}>✕</button>
                </div>
                {pwError && (
                  <div style={{ padding: '10px 14px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, marginBottom: 14 }}>
                    <p style={{ fontSize: 13, color: '#FF2D55' }}>{pwError}</p>
                  </div>
                )}
                <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>현재 비밀번호</label>
                    <input type="password" value={pwForm.current} onChange={e => setPwForm(f => ({...f, current: e.target.value}))} placeholder="현재 비밀번호를 입력해주세요." style={{ fontSize: 13, padding: '9px 12px', height: 'auto' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>변경 비밀번호 <span style={{ fontSize: 11, fontWeight: 400 }}>(영문, 숫자 필수, 4~8자리)</span></label>
                    <input type="password" value={pwForm.next} onChange={e => setPwForm(f => ({...f, next: e.target.value}))} placeholder="영문, 숫자 필수, 4~8자리" style={{ fontSize: 13, padding: '9px 12px', height: 'auto' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>변경 비밀번호 확인</label>
                    <input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({...f, confirm: e.target.value}))} placeholder="영문, 숫자 필수, 4~8자리" style={{ fontSize: 13, padding: '9px 12px', height: 'auto' }} />
                    {pwForm.confirm && <p style={{ fontSize: 11, marginTop: 4, color: pwForm.next === pwForm.confirm ? '#00C896' : '#FF2D55' }}>{pwForm.next === pwForm.confirm ? '✓ 비밀번호가 일치합니다.' : '✗ 비밀번호가 일치하지 않습니다.'}</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setShowPasswordModal(false); setPwError(''); }}
                    style={{ flex: 1, padding: '12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>취소</button>
                  <button onClick={handlePasswordChange} disabled={pwLoading}
                    style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                    {pwLoading ? '변경 중...' : '설정'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 서비스 관리 (인플루언서) */}
          {activeMenu === 'services' && isInfluencer && (
            <div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800 }}>서비스 관리</h2>
                  <button onClick={() => setShowServiceForm(!showServiceForm)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    <Plus size={14} /> 서비스 등록
                  </button>
                </div>

                {/* 서비스 등록 폼 */}
                {showServiceForm && (
                  <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>새 서비스 등록</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>플랫폼 *</label>
                        <select value={serviceForm.platform} onChange={e => setServiceForm(f => ({ ...f, platform: e.target.value }))}
                          style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
                          <option value="youtube">📺 유튜브</option>
                          <option value="instagram">📸 인스타그램</option>
                          <option value="tiktok">🎵 틱톡</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>카테고리 *</label>
                        <select value={serviceForm.category} onChange={e => setServiceForm(f => ({ ...f, category: e.target.value }))}
                          style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
                          <option value="">카테고리 선택</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>서비스 제목 *</label>
                        <input value={serviceForm.title} onChange={e => setServiceForm(f => ({ ...f, title: e.target.value }))} placeholder="서비스 제목 입력" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>채널명</label>
                        <input value={serviceForm.channel_name} onChange={e => setServiceForm(f => ({ ...f, channel_name: e.target.value }))} placeholder="채널명 입력" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>채널 URL</label>
                        <input value={serviceForm.channel_url} onChange={e => setServiceForm(f => ({ ...f, channel_url: e.target.value }))} placeholder="https://youtube.com/..." style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>구독자/팔로워 수</label>
                        <input value={serviceForm.subscriber_count} onChange={e => setServiceForm(f => ({ ...f, subscriber_count: e.target.value }))} placeholder="예: 10만" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>서비스 소개</label>
                      <textarea value={serviceForm.description} onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))} placeholder="서비스 소개를 입력하세요"
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', minHeight: 80, boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>브랜디드 최소광고비</label>
                        <input value={serviceForm.price_branded} onChange={e => setServiceForm(f => ({ ...f, price_branded: e.target.value }))} placeholder="예: 3000000" type="number" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>PPL 최소광고비</label>
                        <input value={serviceForm.price_ppl} onChange={e => setServiceForm(f => ({ ...f, price_ppl: e.target.value }))} placeholder="예: 1500000" type="number" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>맞춤형</label>
                        <input value={serviceForm.price_custom} onChange={e => setServiceForm(f => ({ ...f, price_custom: e.target.value }))} placeholder="협의" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleAddService} disabled={serviceLoading}
                        style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        {serviceLoading ? '등록 중...' : '등록하기'}
                      </button>
                      <button onClick={() => setShowServiceForm(false)} style={{ padding: '9px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>취소</button>
                    </div>
                  </div>
                )}

                {/* 서비스 목록 */}
                {services.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: 36, marginBottom: 12 }}>📋</p>
                    <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>등록된 서비스가 없어요</p>
                    <p style={{ fontSize: 13 }}>서비스를 등록하면 광고주들이 찾을 수 있어요</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {services.map(svc => (
                      <div key={svc.id} style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                              <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                                {svc.platform === 'youtube' ? '📺' : svc.platform === 'instagram' ? '📸' : '🎵'} {svc.platform}
                              </span>
                              <span style={{ fontSize: 11, background: 'var(--bg-card)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 20 }}>{svc.category}</span>
                            </div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{svc.title}</h3>
                            {svc.channel_name && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>채널: {svc.channel_name} {svc.subscriber_count && `· ${svc.subscriber_count}`}</p>}
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {svc.channel_url && (
                              <a href={svc.channel_url} target="_blank" rel="noreferrer" style={{ padding: '5px 8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <ExternalLink size={13} />
                              </a>
                            )}
                            <button onClick={() => handleDeleteService(svc.id)} style={{ padding: '5px 8px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 6, color: '#FF2D55', cursor: 'pointer' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        {svc.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>{svc.description}</p>}
                        <div style={{ display: 'flex', gap: 12 }}>
                          {svc.price_branded > 0 && <span style={{ fontSize: 12, color: '#FF2D55', fontWeight: 600 }}>브랜디드 {svc.price_branded.toLocaleString()}원~</span>}
                          {svc.price_ppl > 0 && <span style={{ fontSize: 12, color: '#FF6B35', fontWeight: 600 }}>PPL {svc.price_ppl.toLocaleString()}원~</span>}
                          {svc.price_custom && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>맞춤형 {svc.price_custom}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 프로젝트 관리 */}
          {activeMenu === 'projects' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>프로젝트 관리</h2>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {['유튜브', '인스타그램', '틱톡'].map((t, i) => (
                  <button key={t} style={{ padding: '7px 16px', borderRadius: 8, border: i === 0 ? 'none' : '1px solid var(--border)', background: i === 0 ? 'rgba(255,45,85,0.1)' : 'transparent', color: i === 0 ? '#FF2D55' : 'var(--text-muted)', fontSize: 13, fontWeight: i === 0 ? 700 : 400, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>📂</p>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>진행중인 프로젝트가 없어요</p>
                <p style={{ fontSize: 13, marginBottom: 20 }}>{isInfluencer ? '광고주가 광고를 요청하면 여기서 확인할 수 있어요' : '인플루언서를 찾아 광고를 요청해보세요'}</p>
                {!isInfluencer && <Link href="/search" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>인플루언서 찾기</Link>}
              </div>
            </div>
          )}

          {/* 수익 관리 */}
          {activeMenu === 'revenue' && isInfluencer && (
            <div>
              {/* 수익금 요약 */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
                {[
                  { label: '출금 가능 수익금', value: '0원', color: '#FF2D55', icon: '💳' },
                  { label: '예상 수익금', value: '0원', color: '#FFB800', icon: '⏳' },
                  { label: '출금 완료 수익금', value: '0원', color: '#00C896', icon: '✅' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</p>
                    </div>
                    <p style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* 탭: 수익내역 / 출금내역 / 세금계산서 */}
              <RevenueManager userId={user?.id} isMobile={isMobile} />
            </div>
          )}

          {/* 결제 내역 */}
          {activeMenu === 'payments' && !isInfluencer && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>결제 내역</h2>
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>🧾</p>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>결제 내역이 없어요</p>
                <p style={{ fontSize: 13 }}>광고 결제 후 내역이 여기에 표시돼요</p>
              </div>
            </div>
          )}

          {/* 쿠폰 */}
          {activeMenu === 'coupons' && !isInfluencer && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>쿠폰</h2>
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>🎟️</p>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>보유한 쿠폰이 없어요</p>
                <p style={{ fontSize: 13, marginBottom: 16 }}>이벤트나 프로모션을 통해 쿠폰을 받을 수 있어요</p>
                <Link href="/cs" style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(255,45,85,0.1)', color: '#FF2D55', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>이벤트 확인하기</Link>
              </div>
            </div>
          )}

          {/* 관심 인플루언서 */}
          {activeMenu === 'favorites' && !isInfluencer && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>관심 인플루언서</h2>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 36, marginBottom: 12 }}>❤️</p>
                  <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>관심 인플루언서가 없어요</p>
                  <p style={{ fontSize: 13, marginBottom: 20 }}>인플루언서 상세 페이지에서 하트를 눌러 저장하세요</p>
                  <Link href="/search" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>인플루언서 찾기</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                  {favorites.map(fav => (
                    <div key={fav.id} style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <img src={fav.channel_thumbnail || 'https://i.pravatar.cc/150'} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                        <button onClick={() => handleDeleteFavorite(fav.id)} style={{ background: 'none', border: 'none', color: '#FF2D55', cursor: 'pointer', fontSize: 18 }}>❤️</button>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{fav.channel_name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{fav.subscriber_count}</p>
                      <Link href={`/influencer/${fav.influencer_channel_id}`} style={{ fontSize: 12, color: '#FF2D55', textDecoration: 'none', fontWeight: 600 }}>상세 보기 →</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Q&A */}
          {activeMenu === 'qna' && !isInfluencer && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>Q&A</h2>
                <button onClick={() => setShowQnaForm(!showQnaForm)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  <Plus size={14} /> 문의 등록
                </button>
              </div>
              {showQnaForm && (
                <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>문의 등록</h3>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>상담 분류</label>
                      <select value={qnaForm.category} onChange={e => setQnaForm(f => ({ ...f, category: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
                        {['건의사항', '신고하기', '서비스 오류'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>제목</label>
                      <input value={qnaForm.title} onChange={e => setQnaForm(f => ({ ...f, title: e.target.value }))} placeholder="문의 제목을 입력하세요" style={{ fontSize: 13, padding: '8px 12px', height: 'auto' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>내용</label>
                      <textarea value={qnaForm.content} onChange={e => setQnaForm(f => ({ ...f, content: e.target.value }))} placeholder="문의 내용을 입력하세요"
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', minHeight: 100, boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleAddQna} style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>등록하기</button>
                      <button onClick={() => setShowQnaForm(false)} style={{ padding: '9px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>취소</button>
                    </div>
                  </div>
                </div>
              )}
              {qnaList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 36, marginBottom: 12 }}>💬</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>문의 내역이 없어요</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {qnaList.map(q => (
                    <div key={q.id} style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{q.category}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: q.status === '답변완료' ? '#00C896' : '#FFB800', background: q.status === '답변완료' ? 'rgba(0,200,150,0.1)' : 'rgba(255,184,0,0.1)', padding: '2px 8px', borderRadius: 20 }}>{q.status}</span>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(q.created_at).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{q.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{q.content}</p>
                      {q.answer && (
                        <div style={{ marginTop: 10, padding: '10px', background: 'rgba(0,200,150,0.05)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: 8 }}>
                          <p style={{ fontSize: 12, color: '#00C896', fontWeight: 600, marginBottom: 4 }}>답변</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 알림 */}
          {activeMenu === 'notifications' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>알림</h2>
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>🔔</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>새 알림이 없어요</p>
              </div>
            </div>
          )}

          {/* 설정 */}
          {activeMenu === 'settings' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>설정</h2>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>알림 전체 설정</p>
                  <button onClick={() => { const all = Object.values(notifSettings).every(Boolean); setNotifSettings({ message: !all, notice: !all, ad_request: !all, stage: !all }); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: Object.values(notifSettings).every(Boolean) ? '#FF2D55' : 'var(--text-muted)' }}>
                    {Object.values(notifSettings).every(Boolean) ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>
                {[
                  { key: 'message', label: '메시지 알림', desc: '메시지가 있을 때 알림으로 받을 수 있습니다.' },
                  { key: 'notice', label: '공지/이벤트 알림', desc: '공지/이벤트를 알림으로 받을 수 있습니다.' },
                  { key: 'ad_request', label: isInfluencer ? '광고 요청 알림' : '안전결제 요청 알림', desc: '요청이 있을 때 알림으로 받을 수 있습니다.' },
                  { key: 'stage', label: '단계 알림', desc: '프로젝트 단계 변경 시 알림으로 받을 수 있습니다.' },
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</p>
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

// 수익 관리 컴포넌트
function RevenueManager({ userId, isMobile }: { userId: string; isMobile: boolean }) {
  const [revenueTab, setRevenueTab] = useState<'revenue'|'withdrawal'|'tax'>('revenue');
  const [withdrawalForm, setWithdrawalForm] = useState({ bank: '', account: '', holder: '', amount: '' });
  const [taxEmail, setTaxEmail] = useState('');
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  const BANKS = ['국민은행', '신한은행', '우리은행', 'IBK기업은행', 'KEB하나은행', '농협', '카카오뱅크', '토스뱅크'];

  const submitWithdrawal = async () => {
    if (!withdrawalForm.bank || !withdrawalForm.account || !withdrawalForm.holder || !withdrawalForm.amount) {
      alert('모든 항목을 입력해주세요.'); return;
    }
    const { supabase } = await import('../lib/supabase');
    await supabase.from('withdrawals').insert({
      influencer_id: userId,
      bank_name: withdrawalForm.bank,
      account_number: withdrawalForm.account,
      account_holder: withdrawalForm.holder,
      amount: parseInt(withdrawalForm.amount.replace(/[^0-9]/g, '')),
      status: '출금 신청',
    });
    alert('출금 신청이 완료되었습니다.');
    setWithdrawalForm({ bank: '', account: '', holder: '', amount: '' });
  };

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      {/* 탭 */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {[['revenue','수익 내역'], ['withdrawal','출금 내역'], ['tax','월별 세금계산서']].map(([val, label]) => (
          <button key={val} onClick={() => setRevenueTab(val as any)}
            style={{ flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: revenueTab === val ? 700 : 500, background: 'transparent', color: revenueTab === val ? '#FF2D55' : 'var(--text-muted)', borderBottom: revenueTab === val ? '2px solid #FF2D55' : '2px solid transparent' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px' }}>
        {/* 수익 내역 */}
        {revenueTab === 'revenue' && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>💰</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>아직 수익 내역이 없어요</p>
            <p style={{ fontSize: 13 }}>광고 진행 후 수익이 발생하면 여기서 확인할 수 있어요</p>
          </div>
        )}

        {/* 출금 신청 */}
        {revenueTab === 'withdrawal' && (
          <div>
            <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>출금 신청</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>은행</label>
                  <select value={withdrawalForm.bank} onChange={e => setWithdrawalForm(f => ({...f, bank: e.target.value}))}
                    style={{ width: '100%', padding: '9px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: withdrawalForm.bank ? 'var(--text)' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
                    <option value="">은행 선택</option>
                    {BANKS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>계좌번호</label>
                  <input value={withdrawalForm.account} onChange={e => setWithdrawalForm(f => ({...f, account: e.target.value}))} placeholder="- 없이 숫자만 입력" style={{ fontSize: 13, padding: '9px 12px', height: 'auto' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>예금주명</label>
                  <input value={withdrawalForm.holder} onChange={e => setWithdrawalForm(f => ({...f, holder: e.target.value}))} placeholder="예금주명 입력" style={{ fontSize: 13, padding: '9px 12px', height: 'auto' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>출금 신청 금액</label>
                  <input value={withdrawalForm.amount} onChange={e => setWithdrawalForm(f => ({...f, amount: e.target.value}))} placeholder="예: 100000" type="number" style={{ fontSize: 13, padding: '9px 12px', height: 'auto' }} />
                </div>
              </div>
              <button onClick={submitWithdrawal}
                style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>출금 신청</button>
            </div>
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: 13 }}>출금 내역이 없어요</p>
            </div>
          </div>
        )}

        {/* 세금계산서 */}
        {revenueTab === 'tax' && (
          <div>
            <div style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>세금계산서 수신 이메일</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="email" value={taxEmail} onChange={e => setTaxEmail(e.target.value)} placeholder="세금계산서 수신 이메일 주소" style={{ flex: 1, fontSize: 13, padding: '9px 12px', height: 'auto' }} />
                <button onClick={() => alert('저장되었습니다.')} style={{ padding: '9px 16px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>저장</button>
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                    {['연월', '광고금액', '수익금', '쿠폰 사용', '수수료', '세금계산서 발행금액', '다운로드'].map(h =>
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <p style={{ fontSize: 13 }}>발행된 세금계산서가 없어요</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
