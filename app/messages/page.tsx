'use client';
import { useState } from 'react';
import Header from '../components/Header';
import { Send, AlertTriangle, Search } from 'lucide-react';

const BANNED_KEYWORDS = [
  '직거래', '직접 결제', '직접 송금', '카카오페이', '토스로', '계좌로 보내', '수수료 아끼',
  '카카오톡 아이디', '카톡 ID', '내 번호', '전화번호', '텔레그램', '선입금', '보증금',
];

const CHATS = [
  { id: 1, name: '워크맨', avatar: 'https://i.pravatar.cc/40?img=1', lastMsg: '기획안 검토 부탁드립니다!', time: '10분 전', unread: 2 },
  { id: 2, name: '보겸TV', avatar: 'https://i.pravatar.cc/40?img=2', lastMsg: '촬영 일정 조율이 가능할까요?', time: '1시간 전', unread: 0 },
  { id: 3, name: '헤이지니', avatar: 'https://i.pravatar.cc/40?img=3', lastMsg: '영상 초안 올려드렸습니다.', time: '어제', unread: 1 },
];

const INITIAL_MESSAGES = [
  { id: 1, from: 'other', text: '안녕하세요! 광고 문의 드립니다.', time: '오전 10:00' },
  { id: 2, from: 'me', text: '안녕하세요! 네, 말씀해 주세요 😊', time: '오전 10:02' },
  { id: 3, from: 'other', text: '신제품 립스틱 브랜디드 콘텐츠 제작 관련해서 연락드렸어요. 가능하신가요?', time: '오전 10:03' },
  { id: 4, from: 'me', text: '네 가능합니다! 기획안 초안 보내드릴게요. 예산은 어느 정도 생각하고 계신가요?', time: '오전 10:05' },
  { id: 5, from: 'other', text: '500만원 정도 생각하고 있어요. 기획안 검토 부탁드립니다!', time: '오전 10:06' },
];

function detectBannedKeyword(text: string): string | null {
  const lower = text.toLowerCase();
  return BANNED_KEYWORDS.find(kw => lower.includes(kw.toLowerCase())) || null;
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(CHATS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [warning, setWarning] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const banned = detectBannedKeyword(input);
    if (banned) {
      setWarning(`"${banned}" 키워드가 포함된 메시지는 플랫폼 정책상 발송이 제한될 수 있습니다. 안전결제를 이용해 주세요.`);
      return;
    }
    setWarning(null);
    setMessages(prev => [...prev, { id: Date.now(), from: 'me', text: input, time: '방금' }]);
    setInput('');
  };

  return (
    <div>
      <Header isLoggedIn={true} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px', height: 'calc(100vh - 120px)', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>

        {/* Chat list */}
        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>메시지</p>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="검색..." style={{ paddingLeft: 30, fontSize: 13, height: 34 }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {CHATS.filter(c => c.name.includes(searchQuery)).map(chat => (
              <button key={chat.id} onClick={() => setSelectedChat(chat)}
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

        {/* Chat window */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={selectedChat.avatar} alt={selectedChat.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 15 }}>{selectedChat.name}</p>
              <p style={{ fontSize: 12, color: '#00C896' }}>● 온라인</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
                {msg.from === 'other' && (
                  <img src={selectedChat.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ background: msg.from === 'me' ? 'linear-gradient(135deg, #FF2D55, #FF6B35)' : 'var(--bg-card2)', color: msg.from === 'me' ? 'white' : 'var(--text)', padding: '10px 14px', borderRadius: msg.from === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 14, maxWidth: 340, lineHeight: 1.5 }}>
                    {msg.text}
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, textAlign: msg.from === 'me' ? 'right' : 'left' }}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          {warning && (
            <div style={{ margin: '0 16px 8px', padding: '10px 14px', background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <AlertTriangle size={15} color="#FFB800" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: '#FFB800', lineHeight: 1.5 }}>{warning}</p>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <input value={input} onChange={e => { setInput(e.target.value); setWarning(null); }}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="메시지를 입력하세요..."
              style={{ flex: 1, fontSize: 14, height: 42 }} />
            <button onClick={sendMessage}
              style={{ padding: '0 16px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
