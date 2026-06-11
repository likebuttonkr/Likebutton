'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, Briefcase, MessageSquare, Heart, CreditCard, Bell, Settings, ChevronRight, Star, TrendingUp, DollarSign, Package, FileText, LogOut } from 'lucide-react';

const ADVERTISER_PROJECTS = [
  { id: 1, influencer: '워크맨', channel: '유튜브', title: '신제품 런칭 캠페인', status: '광고 진행', statusColor: '#00C896', price: '5,000,000', date: '2024.03.15', thumbnail: 'https://i.pravatar.cc/48?img=1' },
  { id: 2, influencer: '보겸TV', channel: '유튜브', title: '브랜드 인지도 캠페인', status: '영상 피드백', statusColor: '#FFB800', price: '3,000,000', date: '2024.03.10', thumbnail: 'https://i.pravatar.cc/48?img=2' },
  { id: 3, influencer: '헤이지니', channel: '유튜브', title: '시즌 할인 이벤트', status: '광고 완료', statusColor: '#8888AA', price: '2,500,000', date: '2024.02.28', thumbnail: 'https://i.pravatar.cc/48?img=3' },
  { id: 4, influencer: '꽈뚜룹', channel: '유튜브', title: '신규 서비스 홍보', status: '광고 기획안', statusColor: '#FF6B35', price: '4,000,000', date: '2024.03.20', thumbnail: 'https://i.pravatar.cc/48?img=4' },
];

const INFLUENCER_PROJECTS = [
  { id: 1, advertiser: '뷰티코리아', title: '신제품 립스틱 PPL', status: '광고 진행', statusColor: '#00C896', price: '2,000,000', date: '2024.03.15' },
  { id: 2, advertiser: '푸드스타트업', title: '밀키트 브랜디드 콘텐츠', status: '영상 피드백', statusColor: '#FFB800', price: '3,500,000', date: '2024.03.10' },
  { id: 3, advertiser: '패션브랜드X', title: '봄 시즌 룩북', status: '광고 완료', statusColor: '#8888AA', price: '1,800,000', date: '2024.02.20' },
];

const LIKED_INFLUENCERS = [
  { id: 'UCxxx1', name: '워크맨', subs: '345만', price: '300만원~', rating: 4.9, thumbnail: 'https://i.pravatar.cc/48?img=5' },
  { id: 'UCxxx2', name: '보겸TV', subs: '280만', price: '250만원~', rating: 4.7, thumbnail: 'https://i.pravatar.cc/48?img=6' },
  { id: 'UCxxx3', name: '헤이지니', subs: '190만', price: '180만원~', rating: 4.8, thumbnail: 'https://i.pravatar.cc/48?img=7' },
];

export default function MyPage() {
  const [userType, setUserType] = useState<'advertiser' | 'influencer'>('advertiser');
  const [activeTab, setActiveTab] = useState('projects');

  const navItems = userType === 'advertiser'
    ? [
        { id: 'projects', label: '프로젝트 관리', icon: Briefcase },
        { id: 'liked', label: '관심 인플루언서', icon: Heart },
        { id: 'messages', label: '메시지', icon: MessageSquare },
        { id: 'payments', label: '결제 내역', icon: CreditCard },
        { id: 'profile', label: '프로필', icon: User },
        { id: 'settings', label: '설정', icon: Settings },
      ]
    : [
        { id: 'projects', label: '프로젝트 관리', icon: Briefcase },
        { id: 'revenue', label: '수익 관리', icon: DollarSign },
        { id: 'messages', label: '메시지', icon: MessageSquare },
        { id: 'service', label: '서비스 관리', icon: Package },
        { id: 'profile', label: '프로필', icon: User },
        { id: 'settings', label: '설정', icon: Settings },
      ];

  return (
    <div>
      <Header isLoggedIn={true} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28, alignItems: 'start' }}>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 88 }}>
          {/* User type toggle */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15 }}>홍길동님</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>likebuttonkr@gmail.com</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, background: 'var(--bg-card2)', borderRadius: 8, padding: 4 }}>
              {(['advertiser', 'influencer'] as const).map(type => (
                <button key={type} onClick={() => { setUserType(type); setActiveTab('projects'); }}
                  style={{ padding: '7px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: userType === type ? 'var(--bg-card)' : 'transparent', color: userType === type ? 'var(--text)' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                  {type === 'advertiser' ? '광고주' : '인플루언서'}
                </button>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            {navItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '13px 16px', border: 'none', cursor: 'pointer', background: activeTab === item.id ? 'rgba(255,45,85,0.08)' : 'transparent', color: activeTab === item.id ? '#FF2D55' : 'var(--text-muted)', borderLeft: activeTab === item.id ? '3px solid #FF2D55' : '3px solid transparent', transition: 'all 0.2s', borderBottom: i < navItems.length - 1 ? '1px solid var(--border)' : 'none', textAlign: 'left' }}>
                  <Icon size={16} />
                  <span style={{ fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400 }}>{item.label}</span>
                  {activeTab === item.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                </button>
              );
            })}
            <button style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '13px 16px', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', textAlign: 'left' }}>
              <LogOut size={16} />
              <span style={{ fontSize: 14 }}>로그아웃</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main>
          {/* Stats */}
          {(() => {
            const stats = userType === 'advertiser' ? [
              { label: '진행중 프로젝트', value: '3', icon: '📋', color: '#FF2D55' },
              { label: '완료 프로젝트', value: '12', icon: '✅', color: '#00C896' },
              { label: '총 집행 광고비', value: '4,200만', icon: '💰', color: '#FFB800' },
              { label: '관심 인플루언서', value: '8', icon: '❤️', color: '#FF6B35' },
            ] : [
              { label: '진행중 프로젝트', value: '2', icon: '📋', color: '#FF2D55' },
              { label: '이번달 수익', value: '550만', icon: '💰', color: '#00C896' },
              { label: '누적 수익', value: '3,200만', icon: '📈', color: '#FFB800' },
              { label: '평균 평점', value: '4.9', icon: '⭐', color: '#FF6B35' },
            ];
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 24 }}>
                {stats.map(stat => (
                  <div key={stat.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Projects tab */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>프로젝트 관리</h2>
                {userType === 'advertiser' && (
                  <Link href="/search" style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>+ 새 프로젝트</Link>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(userType === 'advertiser' ? ADVERTISER_PROJECTS : INFLUENCER_PROJECTS).map(proj => (
                  <Link key={proj.id} href={`/project/${proj.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                      {'thumbnail' in proj && (
                        <img src={(proj as any).thumbnail} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj.title}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {userType === 'advertiser' ? `${(proj as any).influencer} · ${(proj as any).channel}` : `광고주: ${(proj as any).advertiser}`}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{proj.date}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: proj.statusColor, background: `${proj.statusColor}18`, padding: '3px 10px', borderRadius: 20, marginBottom: 6, display: 'inline-block' }}>{proj.status}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#FF2D55' }}>{parseInt(proj.price).toLocaleString()}원</div>
                      </div>
                      <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Liked influencers */}
          {activeTab === 'liked' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>관심 인플루언서</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                {LIKED_INFLUENCERS.map(inf => (
                  <Link key={inf.id} href={`/influencer/${inf.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: 18 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                        <img src={inf.thumbnail} alt={inf.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{inf.name}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>구독자 {inf.subs}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Star size={12} fill="#FFB800" color="#FFB800" />
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{inf.rating}</span>
                        </div>
                        <span style={{ fontSize: 13, color: '#FF2D55', fontWeight: 700 }}>{inf.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>메시지</h2>
              <Link href="/messages" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MessageSquare size={20} color="#FF2D55" />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>메시지함 열기</span>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </Link>
            </div>
          )}

          {/* Revenue (influencer) */}
          {activeTab === 'revenue' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>수익 관리</h2>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>출금 가능 수익금</p>
                <p style={{ fontSize: 36, fontWeight: 900, color: '#FF2D55', marginBottom: 16 }}>3,200,000원</p>
                <button style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>출금 신청</button>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>수익 내역</p>
                {INFLUENCER_PROJECTS.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{p.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.date}</p>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#00C896' }}>+{parseInt(p.price).toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments (advertiser) */}
          {activeTab === 'payments' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>결제 내역</h2>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-card2)' }}>
                      {['인플루언서', '프로젝트명', '금액', '상태', '날짜'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ADVERTISER_PROJECTS.map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.influencer}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.title}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#FF2D55' }}>{parseInt(p.price).toLocaleString()}원</td>
                        <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 11, fontWeight: 700, color: p.statusColor, background: `${p.statusColor}18`, padding: '2px 8px', borderRadius: 20 }}>{p.status}</span></td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>프로필</h2>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
                {[
                  { label: '이름', value: '홍길동' },
                  { label: '이메일', value: 'likebuttonkr@gmail.com' },
                  { label: '휴대폰', value: '010-1234-5678' },
                  { label: userType === 'advertiser' ? '회사명' : '채널명', value: userType === 'advertiser' ? '라이크버튼 주식회사' : '라이크버튼TV' },
                ].map(field => (
                  <div key={field.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{field.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{field.value}</span>
                  </div>
                ))}
                <button style={{ marginTop: 20, padding: '12px 24px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>프로필 수정</button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
