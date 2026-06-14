'use client';
import { showToast } from '../components/Toast';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Send, AlertTriangle, Search, Paperclip, Shield, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const BANNED_KEYWORDS = [
  '직거래', '직접 결제', '직접 송금', '카카오페이', '토스로', '계좌로 보내', '수수료 아끼',
  '카카오톡 아이디', '카톡 ID', '내 번호', '전화번호', '텔레그램', '선입금', '보증금',
  '외부 결제', '플랫폼 밖', '따로 결제',
];

const CHATS = [
  { id: 1, name: '워크맨', role: '인플루언서', avatar: 'https://i.pravatar.cc/40?img=1', lastMsg: '기획안 검토 부탁드립니다!', time: '10분 전', unread: 2 },
  { id: 2, name: '보겸TV', role: '인플루언서', avatar: 'https://i.pravatar.cc/40?img=2', lastMsg: '촬영 일정 조율이 가능할까요?', time: '1시간 전', unread: 0 },
  { id: 3, name: '헤이지니', role: '인플루언서', avatar: 'https://i.pravatar.cc/40?img=3', lastMsg: '영상 초안 올려드렸습니다.', time: '어제', unread: 1 },
];

const INITIAL_MESSAGES: Record<number, any[]> = {
  1: [
    { id: 1, from: 'other', text: '안녕하세요! 광고 문의 드립니다.', time: '오전 10:00' },
    { id: 2, from: 'me', text: '안녕하세요! 네, 말씀해 주세요 😊', time: '오전 10:02' },
    { id: 3, from: 'other', text: '신제품 립스틱 브랜디드 콘텐츠 제작 관련해서 연락드렸어요.', time: '오전 10:03' },
    { id: 4, from: 'me', text: '네 가능합니다! 예산은 어느 정도 생각하고 계신가요?', time: '오전 10:05' },
    { id: 5, from: 'other', text: '500만원 정도 생각하고 있어요. 기획안 검토 부탁드립니다!', time: '오전 10:06' },
    { id: 6, from: 'other', type: 'safe_payment', text: '', time: '오전 10:07',
      safePayment: { channelName: '워크맨', projectTitle: '신제품 립스틱 브랜디드 캠페인', workDays: 25, adType: '브랜디드, PPL', amount: 5000000 } },
  ],
  2: [
    { id: 1, from: 'other', text: '촬영 일정 조율이 가능할까요?', time: '1시간 전' },
  ],
  3: [
    { id: 1, from: 'other', text: '영상 초안 올려드렸습니다. 확인해주세요!', time: '어제' },
  ],
};

function detectBannedKeyword(text: string): string | null {
  const lower = text.toLowerCase();
  return BANNED_KEYWORDS.find(kw => lower.includes(kw.toLowerCase())) || null;
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(CHATS[0]);
  const [allMessages, setAllMessages] = useState(INITIAL_MESSAGES);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dbChats, setDbChats] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [warning, setWarning] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSafePayment, setShowSafePayment] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, selectedChat]);

  // 실제 메시지 DB에서 로드
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setCurrentUser(session.user);

      // 실제 메시지 DB 로드
      const { data: msgs } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(name, avatar_url)')
        .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
        .order('created_at', { ascending: true });

      if (msgs && msgs.length > 0) {
        // 대화 상대별로 그룹핑
        const grouped: Record<string, any[]> = {};
        msgs.forEach(msg => {
          const otherId = msg.sender_id === session.user.id ? msg.receiver_id : msg.sender_id;
          if (!grouped[otherId]) grouped[otherId] = [];
          grouped[otherId].push({
            id: msg.id,
            from: msg.sender_id === session.user.id ? 'me' : 'other',
            text: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          });
        });
        // allMessages에 DB 데이터 병합
        setAllMessages(prev => ({ ...prev, ...grouped }));
      }
    };
    init();
  }, []);

  // Supabase Realtime 메시지 구독
  useEffect(() => {
    const channel = (async () => {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const ch = supabase
        .channel('messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${session.user.id}`,
        }, (payload) => {
          const msg = payload.new as any;
          setAllMessages(prev => ({
            ...prev,
            [selectedChat.id]: [...(prev[selectedChat.id] || []), {
              id: msg.id, from: 'other', text: msg.content, time: '방금'
            }]
          }));
        })
        .subscribe();
      return ch;
    })();

    return () => { channel.then(ch => ch?.unsubscribe()); };
  }, [selectedChat.id]);

  const messages = allMessages[selectedChat.id] || [];

  const sendMessage = async () => {
    if (!input.trim()) return;
    const banned = detectBannedKeyword(input);
    if (banned) {
      setWarning(`외부로 결제 또는 직접 결제를 유도하는 경우 서비스 이용이 제한됩니다.`);
      return;
    }
    setWarning(null);
    const msgText = input;
    setInput('');
    // UI 즉시 업데이트
    setAllMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), { id: Date.now(), from: 'me', text: msgText, time: '방금' }],
    }));
    // DB 저장
    if (currentUser) {
      await supabase.from('messages').insert({
        sender_id: currentUser.id,
        receiver_id: String(selectedChat.id),
        content: msgText,
      });
    }
  };

  const openPayment = (safePayment: any) => {
    setPaymentData(safePayment);
    setShowPaymentPage(true);
  };

  // 결제하기 페이지
  if (showPaymentPage && paymentData) {
    return <PaymentPage paymentData={paymentData} onBack={() => setShowPaymentPage(false)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header isLoggedIn={true} />
      <div style={{ flex: 1, maxWidth: 1100, margin: '0 auto', padding: isMobile ? '12px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ height: isMobile ? 'calc(100vh - 130px)' : 'calc(100vh - 140px)', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>

          {/* 채팅 목록 */}
          {(!isMobile || showChatList) && (
            <div style={{ borderRight: isMobile ? 'none' : '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>메시지</p>
                <div style={{ position: 'relative' }}>
                  <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="검색..." style={{ paddingLeft: 30, fontSize: 13, height: 34 }} />
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {CHATS.filter(c => c.name.includes(searchQuery)).map(chat => (
                  <button key={chat.id} onClick={() => { setSelectedChat(chat); if (isMobile) setShowChatList(false); }}
                    style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%', padding: '14px 16px', border: 'none', cursor: 'pointer', background: selectedChat.id === chat.id ? 'rgba(255,45,85,0.06)' : 'transparent', borderLeft: selectedChat.id === chat.id ? '3px solid #FF2D55' : '3px solid transparent', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={chat.avatar} alt={chat.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
                      {chat.unread > 0 && <div style={{ position: 'absolute', top: -2, right: -2, background: '#FF2D55', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{chat.unread}</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{chat.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{chat.time}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.lastMsg}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 채팅창 */}
          {(!isMobile || !showChatList) && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {/* 상단 헤더 */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                {isMobile && (
                  <button onClick={() => setShowChatList(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>←</button>
                )}
                <img src={selectedChat.avatar} alt={selectedChat.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>{selectedChat.name}</p>
                  <p style={{ fontSize: 11, color: '#00C896' }}>● 온라인</p>
                </div>
                {/* 안전결제 버튼 (인플루언서 화면) */}
                <button onClick={() => setShowSafePayment(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'linear-gradient(135deg,#00C896,#5B8DEF)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                  <Shield size={14} /> 안전결제
                </button>
              </div>

              {/* 메시지 목록 */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map(msg => {
                  if (msg.type === 'safe_payment') {
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-start', gap: 8 }}>
                        <img src={selectedChat.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 4 }} />
                        <div style={{ background: 'var(--bg-card2)', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 14, padding: '14px 16px', maxWidth: 300 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                            <Shield size={14} color="#00C896" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#00C896' }}>안전결제 요청</span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                            {[
                              { label: '채널명', value: msg.safePayment.channelName },
                              { label: '프로젝트', value: msg.safePayment.projectTitle },
                              { label: '광고 상품', value: msg.safePayment.adType },
                              { label: '작업일', value: `${msg.safePayment.workDays}일` },
                              { label: '광고 금액', value: `${msg.safePayment.amount.toLocaleString()}원` },
                            ].map(info => (
                              <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span>{info.label}</span>
                                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{info.value}</span>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => openPayment(msg.safePayment)}
                            style={{ width: '100%', padding: '9px', background: 'linear-gradient(135deg,#00C896,#5B8DEF)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                            결제하기
                          </button>
                          <button style={{ width: '100%', padding: '7px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, cursor: 'pointer', fontSize: 12, marginTop: 6 }}>
                            취소
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
                      {msg.from === 'other' && (
                        <img src={selectedChat.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      )}
                      <div>
                        <div style={{ background: msg.from === 'me' ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'var(--bg-card2)', color: msg.from === 'me' ? 'white' : 'var(--text)', padding: '10px 14px', borderRadius: msg.from === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 14, maxWidth: 300, lineHeight: 1.5, wordBreak: 'break-word' }}>
                          {msg.text}
                        </div>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, textAlign: msg.from === 'me' ? 'right' : 'left' }}>{msg.time}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* 경고 메시지 */}
              {warning && (
                <div style={{ margin: '0 16px 8px', padding: '10px 14px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start', flexShrink: 0 }}>
                  <AlertTriangle size={15} color="#FF2D55" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: '#FF2D55', lineHeight: 1.5 }}>{warning}</p>
                  </div>
                  <button onClick={() => setWarning(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={13} /></button>
                </div>
              )}

              {/* 입력창 */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 6 }}>
                  <Paperclip size={18} />
                </button>
                <input value={input} onChange={e => { setInput(e.target.value); if (warning) setWarning(null); }}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="메시지를 입력하세요..."
                  style={{ flex: 1, fontSize: 14, height: 42 }} />
                <button onClick={sendMessage}
                  style={{ padding: '0 16px', height: 42, background: input.trim() ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 8, cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 안전결제 요청 팝업 (인플루언서가 요청) */}
      {showSafePayment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px', width: '100%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={18} color="#00C896" /> 안전결제 요청
              </h2>
              <button onClick={() => setShowSafePayment(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <SafePaymentForm chatName={selectedChat.name} onSend={(data) => {
              setAllMessages(prev => ({
                ...prev,
                [selectedChat.id]: [...(prev[selectedChat.id] || []), {
                  id: Date.now(), from: 'me', type: 'safe_payment', text: '', time: '방금',
                  safePayment: data,
                }],
              }));
              setShowSafePayment(false);
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

// 안전결제 요청 폼
function SafePaymentForm({ chatName, onSend }: { chatName: string; onSend: (data: any) => void }) {
  const [form, setForm] = useState({ channelName: chatName, projectTitle: '', workDays: '25', adType: '브랜디드, PPL', amount: '' });
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={{ display: 'grid', gap: 12 }}>
        {[
          { label: '채널명', field: 'channelName', placeholder: '채널명' },
          { label: '프로젝트명', field: 'projectTitle', placeholder: '프로젝트명 입력' },
          { label: '광고 상품', field: 'adType', placeholder: '브랜디드, PPL' },
          { label: '작업일', field: 'workDays', placeholder: '25', suffix: '일' },
          { label: '광고 금액', field: 'amount', placeholder: '5000000', type: 'number' },
        ].map(item => (
          <div key={item.field}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{item.label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input value={(form as any)[item.field]} onChange={e => update(item.field, e.target.value)} placeholder={item.placeholder} type={item.type || 'text'} style={{ fontSize: 13, padding: '8px 12px', height: 'auto', flex: 1 }} />
              {item.suffix && <span style={{ fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>{item.suffix}</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 8 }}>
        <p style={{ fontSize: 12, color: '#00C896', lineHeight: 1.6 }}>안전결제를 통해 계약서 작성부터 정산까지 안전하게 진행됩니다.</p>
      </div>
      <button onClick={() => { if (!form.projectTitle || !form.amount) { showToast('프로젝트명과 금액을 입력해주세요.', 'warning'); return; } onSend({ ...form, amount: parseInt(form.amount), workDays: parseInt(form.workDays) }); }}
        style={{ width: '100%', marginTop: 16, padding: '13px', background: 'linear-gradient(135deg,#00C896,#5B8DEF)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>
        안전결제 요청 전송
      </button>
    </div>
  );
}

// 결제하기 페이지
function PaymentPage({ paymentData, onBack }: { paymentData: any; onBack: () => void }) {
  const [coupon, setCoupon] = useState('');
  const [taxEmail, setTaxEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [paid, setPaid] = useState(false);
  const couponDiscount = coupon ? 50000 : 0;
  const finalAmount = paymentData.amount - couponDiscount;

  if (paid) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Header isLoggedIn={true} />
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(0,200,150,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>입금 대기중입니다.</h2>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 20, textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#FFB800' }}>입금 계좌</p>
            <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '14px', marginBottom: 14 }}>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#FF2D55', marginBottom: 6 }}>{finalAmount.toLocaleString()}원</p>
              <p style={{ fontSize: 14, fontWeight: 700 }}>국민은행 123123123123 라이크버튼</p>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <p>⚠️ 입금 시 반드시 확인해주세요!</p>
              <p>• 주문자명과 실제 입금자의 성함이 다르거나, 입금액이 다를 경우 입금 확인이 어려워 결제 승인이 지연될 수 있습니다.</p>
              <p>• 반드시 입금자명에 이름+휴대폰 번호 뒤 4자리 (홍길동 1234)로 표기 부탁드립니다.</p>
              <p>• 주문 후 24시간 내 입금하지 않으실 경우 주문이 자동 취소됩니다.</p>
              <p>• 문의사항이 있으시면 고객센터 1588-0000으로 문의주시기 바랍니다.</p>
            </div>
          </div>
          <button onClick={onBack} style={{ padding: '12px 32px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, marginRight: 8 }}>메시지로 돌아가기</button>
          <Link href="/mypage" style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>프로젝트 관리</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header isLoggedIn={true} />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, marginBottom: 24 }}>← 메시지로 돌아가기</button>

        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 24 }}>결제하기</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          <div>
            {/* 서비스 정보 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>서비스 정보</h3>
              {[
                { label: '채널명', value: paymentData.channelName },
                { label: '프로젝트명', value: paymentData.projectTitle },
                { label: '광고 상품', value: paymentData.adType },
                { label: '작업일', value: `${paymentData.workDays}일` },
                { label: '2차 라이선스', value: '예' },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{info.label}</span>
                  <span style={{ fontWeight: 600 }}>{info.value}</span>
                </div>
              ))}
            </div>

            {/* 쿠폰 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>사용 가능한 쿠폰</h3>
              <select value={coupon} onChange={e => setCoupon(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
                <option value="">쿠폰을 선택해주세요</option>
                <option value="coupon1">50,000원 할인 쿠폰</option>
              </select>
            </div>

            {/* 결제 방법 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>결제 방법</h3>
              <div style={{ padding: '14px', background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#00C896', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700 }}>무통장입금</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>국민은행 123123123123 라이크버튼</span>
              </div>
            </div>

            {/* 세금계산서 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>세금계산서 신청 <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>(선택)</span></h3>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>세금계산서 수신 이메일</label>
                <input type="email" value={taxEmail} onChange={e => setTaxEmail(e.target.value)} placeholder="이메일 주소 입력" style={{ fontSize: 13, padding: '9px 12px', height: 'auto' }} />
              </div>
            </div>
          </div>

          {/* 결제 정보 사이드바 */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>결제 정보</h3>
              {[
                { label: '광고 금액', value: `${paymentData.amount.toLocaleString()}원` },
                { label: '쿠폰 할인', value: couponDiscount ? `-${couponDiscount.toLocaleString()}원` : '-', color: '#00C896' },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{info.label}</span>
                  <span style={{ fontWeight: 600, color: (info as any).color || 'var(--text)' }}>{info.value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>결제 금액</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#FF2D55' }}>{finalAmount.toLocaleString()}원</span>
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', marginBottom: 14 }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>내용을 확인하였으며, 결제에 동의합니다. 주의사항: 입금 후 24시간 내 확인되지 않으면 자동 취소됩니다.</span>
              </label>

              <button onClick={() => { if (!agreed) { showToast('결제 동의를 체크해주세요.', 'info'); return; } setPaid(true); }} disabled={!agreed}
                style={{ width: '100%', padding: '14px', background: agreed ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'var(--border)', color: 'white', border: 'none', borderRadius: 10, cursor: agreed ? 'pointer' : 'not-allowed', fontSize: 15, fontWeight: 700 }}>
                결제 진행
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
