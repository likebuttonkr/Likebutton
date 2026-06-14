'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Bell, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: '안내', title: '광고 기획안 확정 알림', content: '워크맨님이 광고 기획안을 확정했습니다.', date: '2024.03.10 14:30', isNew: true, link: '/project/1' },
  { id: 2, type: '공지사항', title: '라이크버튼 서비스 업데이트 안내', content: '2024년 3월 주요 업데이트 내용을 안내드립니다.', date: '2024.03.08 10:00', isNew: true, link: '/cs' },
  { id: 3, type: '이벤트', title: '첫 광고 계약 10% 할인 이벤트', content: '첫 광고 계약을 체결하시는 광고주분들께 10% 할인 혜택을 드립니다.', date: '2024.03.01 09:00', isNew: false, link: '/cs' },
  { id: 4, type: '안내', title: '안전결제 요청 알림', content: '워크맨님이 안전결제를 요청했습니다. 확인해주세요.', date: '2024.02.28 16:45', isNew: false, link: '/messages' },
  { id: 5, type: '안내', title: '영상 피드백 확정 알림', content: '광고주가 영상 피드백을 확정했습니다.', date: '2024.02.25 11:20', isNew: false, link: '/project/1' },
];

const TYPE_COLOR: Record<string, string> = {
  '공지사항': '#5B8DEF',
  '이벤트': '#00C896',
  '안내': '#FF2D55',
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
    });
  }, []);

  const markAllRead = () => {
    setNotifications(n => n.map(item => ({ ...item, isNew: false })));
  };

  const newCount = notifications.filter(n => n.isNew).length;

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 900 }}>알림</h1>
            {newCount > 0 && (
              <span style={{ background: '#FF2D55', color: 'white', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                {newCount}개 새 알림
              </span>
            )}
          </div>
          {newCount > 0 && (
            <button onClick={markAllRead}
              style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              전체 읽음 처리
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '60px', textAlign: 'center' }}>
            <Bell size={36} color="var(--text-muted)" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>알림이 없어요</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>새로운 알림이 오면 여기서 확인할 수 있어요</p>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            {notifications.map((noti, i) => (
              <Link key={noti.id} href={noti.link}
                onClick={() => setNotifications(n => n.map(item => item.id === noti.id ? { ...item, isNew: false } : item))}
                style={{ textDecoration: 'none', display: 'flex', gap: 14, padding: '16px 20px', borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none', background: noti.isNew ? 'rgba(255,45,85,0.03)' : 'transparent', alignItems: 'flex-start' }}>
                {/* 아이콘 */}
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${TYPE_COLOR[noti.type]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {noti.type === '공지사항' ? '📢' : noti.type === '이벤트' ? '🎉' : '🔔'}
                </div>
                {/* 내용 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: TYPE_COLOR[noti.type], background: `${TYPE_COLOR[noti.type]}18`, padding: '2px 8px', borderRadius: 20 }}>
                      {noti.type}
                    </span>
                    {noti.isNew && <span style={{ fontSize: 10, background: '#FF2D55', color: 'white', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>N</span>}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{noti.title}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 4 }}>{noti.content}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{noti.date}</p>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 4 }} />
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}