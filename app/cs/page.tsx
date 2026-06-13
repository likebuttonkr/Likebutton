'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronUp, Plus, ArrowLeft, Paperclip, X } from 'lucide-react';

const MOCK_NOTICES = [
  { id: 1, title: '라이크버튼 서비스 업데이트 안내 (2024년 3월)', content: '안녕하세요, 라이크버튼입니다.\n\n2024년 3월 주요 업데이트 내용을 안내드립니다.\n\n1. 인플루언서 검색 필터 기능 강화\n2. 안전결제 시스템 개선\n3. 모바일 UI/UX 개선\n4. 성능 최적화 및 버그 수정\n\n더욱 편리한 서비스를 위해 지속적으로 노력하겠습니다.\n감사합니다.', date: '2024.03.15', isNew: true },
  { id: 2, title: '개인정보 처리방침 개정 안내', content: '개인정보 처리방침이 2024년 2월 1일부터 개정됩니다.\n주요 변경사항을 확인해주세요.', date: '2024.02.28', isNew: false },
  { id: 3, title: '설 연휴 고객센터 운영 안내', content: '설 연휴 기간 동안 고객센터 운영이 제한됩니다.\n2024.02.09 ~ 2024.02.12 고객센터 휴무', date: '2024.02.05', isNew: false },
];

const MOCK_EVENTS = [
  { id: 1, title: '첫 광고 계약 10% 할인 이벤트', period: '2024.03.01 ~ 2024.03.31', status: '진행중', content: '라이크버튼에서 첫 광고 계약을 체결하시는 광고주분들께 10% 할인 혜택을 드립니다.\n\n✅ 대상: 신규 광고주 (첫 계약)\n✅ 혜택: 광고비 10% 할인 쿠폰\n✅ 기간: 2024년 3월 한 달간\n\n지금 바로 인플루언서를 찾아보세요!' },
  { id: 2, title: '인플루언서 채널 등록 이벤트', period: '2024.02.01 ~ 2024.02.29', status: '진료중', content: '인플루언서 채널 등록 이벤트입니다.' },
  { id: 3, title: '신규 가입 쿠폰 지급 이벤트', period: '2024.01.01 ~ 2024.01.31', status: '종료', content: '신규 가입 쿠폰 지급 이벤트가 종료되었습니다.' },
];

const FAQS = [
  { q: '광고 요청은 어떻게 하나요?', a: '인플루언서 검색 페이지에서 원하는 인플루언서를 찾아 상세 페이지로 이동한 후, "광고 요청하기" 버튼을 클릭하세요. 프로젝트명, 릴리즈 일정, 광고 형태 등을 입력하면 인플루언서에게 요청이 전달됩니다.' },
  { q: '안전결제는 어떻게 진행되나요?', a: '인플루언서와 메시지로 소통 후 인플루언서가 안전결제를 요청하면, 광고주는 라이크버튼 플랫폼을 통해 무통장입금으로 결제합니다. 광고 완료 확정 후 인플루언서에게 정산됩니다.' },
  { q: '광고 진행 취소는 가능한가요?', a: '광고 요청 단계에서는 취소가 가능합니다. 입금 이후에는 계약서 조건에 따라 처리됩니다. 자세한 내용은 고객센터로 문의해주세요.' },
  { q: '인플루언서 등록은 어떻게 하나요?', a: '회원가입 시 "인플루언서"를 선택하고, SNS 채널 인증 단계에서 운영 중인 채널 URL을 등록하세요. 승인 후 서비스 관리에서 광고 서비스를 등록할 수 있습니다.' },
  { q: '광고주 가입 후 바로 서비스를 이용할 수 있나요?', a: '광고주는 가입 후 관리자 승인이 필요합니다. 승인까지 업무일 기준 5일 이내 소요되며, 승인 완료 후 이메일로 안내드립니다.' },
];

export default function CSPage() {
  const [tab, setTab] = useState<'notice'|'event'|'faq'|'qna'>('notice');
  const [expandedFaq, setExpandedFaq] = useState<number|null>(null);
  const [eventTab, setEventTab] = useState<'진행중'|'종료'>('진행중');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Q&A
  const [qnaList, setQnaList] = useState<any[]>([]);
  const [showQnaForm, setShowQnaForm] = useState(false);
  const [qnaForm, setQnaForm] = useState({ category: '건의사항', title: '', content: '' });
  const [attachedFile, setAttachedFile] = useState<File|null>(null);
  const [qnaLoading, setQnaLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        loadQna(session.user.id);
      }
    });
  }, []);

  const loadQna = async (uid: string) => {
    const { data } = await supabase.from('qna').select('*').eq('user_id', uid).order('created_at', { ascending: false });
    setQnaList(data || []);
  };

  const submitQna = async () => {
    if (!user) { alert('로그인 후 이용해주세요.'); return; }
    if (!qnaForm.title || !qnaForm.content) { alert('제목과 내용을 입력해주세요.'); return; }
    setQnaLoading(true);
    await supabase.from('qna').insert({ ...qnaForm, user_id: user.id });
    await loadQna(user.id);
    setShowQnaForm(false);
    setQnaForm({ category: '건의사항', title: '', content: '' });
    setAttachedFile(null);
    setQnaLoading(false);
  };

  // 상세 화면
  if (selectedItem) {
    return (
      <div>
        <Header isLoggedIn={!!user} />
        <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>
          <button onClick={() => setSelectedItem(null)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, marginBottom: 24 }}>
            <ArrowLeft size={15} /> 목록으로 돌아가기
          </button>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: isMobile ? '20px' : '32px' }}>
            {selectedItem.status && (
              <span style={{ fontSize: 11, background: selectedItem.status === '진행중' ? 'rgba(0,200,150,0.1)' : 'rgba(255,45,85,0.1)', color: selectedItem.status === '진행중' ? '#00C896' : '#FF2D55', padding: '3px 10px', borderRadius: 20, fontWeight: 700, display: 'inline-block', marginBottom: 12 }}>
                {selectedItem.status}
              </span>
            )}
            <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, marginBottom: 10 }}>{selectedItem.title}</h1>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
              {selectedItem.date && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>등록일 {selectedItem.date}</span>}
              {selectedItem.period && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>기간: {selectedItem.period}</span>}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.9, color: 'var(--text)', whiteSpace: 'pre-line' }}>
              {selectedItem.content}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header isLoggedIn={!!user} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, marginBottom: 8 }}>고객센터</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>라이크버튼 고객센터입니다. 무엇이든 도와드릴게요!</p>

        {/* 탭 */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 4 }}>
          {[['notice','공지사항'],['event','이벤트'],['faq','FAQ'],['qna','Q&A']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val as any)}
              style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: isMobile ? 13 : 14, fontWeight: tab === val ? 700 : 500, background: tab === val ? 'linear-gradient(135deg,#FF2D55,#FF6B35)' : 'transparent', color: tab === val ? 'white' : 'var(--text-muted)', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* 공지사항 */}
        {tab === 'notice' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                  {['번호', '제목', '등록일'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {MOCK_NOTICES.map((notice, i) => (
                  <tr key={notice.id} onClick={() => setSelectedItem(notice)}
                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)', width: 60 }}>{MOCK_NOTICES.length - i}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {notice.isNew && <span style={{ fontSize: 10, background: '#FF2D55', color: 'white', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>N</span>}
                        {notice.title}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{notice.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 이벤트 */}
        {tab === 'event' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['진행중', '종료'] as const).map(t => (
                <button key={t} onClick={() => setEventTab(t)}
                  style={{ padding: '7px 18px', borderRadius: 20, border: `1px solid ${eventTab === t ? '#FF2D55' : 'var(--border)'}`, background: eventTab === t ? 'rgba(255,45,85,0.1)' : 'transparent', color: eventTab === t ? '#FF2D55' : 'var(--text-muted)', fontSize: 13, fontWeight: eventTab === t ? 700 : 400, cursor: 'pointer' }}>
                  {t === '진행중' ? '진행중인 이벤트' : '종료된 이벤트'}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {MOCK_EVENTS.filter(e => eventTab === '진행중' ? e.status !== '종료' : e.status === '종료').map(event => (
                <div key={event.id} onClick={() => setSelectedItem(event)}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: event.status === '종료' ? 'var(--bg-card2)' : 'linear-gradient(135deg,#FF2D55,#FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {event.status === '종료' ? '🏁' : '🎉'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: event.status === '종료' ? 'var(--text-muted)' : '#00C896', background: event.status === '종료' ? 'var(--bg-card2)' : 'rgba(0,200,150,0.1)', padding: '2px 8px', borderRadius: 20 }}>{event.status}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>기간: {event.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {tab === 'faq' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  style={{ width: '100%', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#FF2D55', flexShrink: 0 }}>Q</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>{faq.q}</span>
                  </div>
                  {expandedFaq === i ? <ChevronUp size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} /> : <ChevronDown size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                </button>
                {expandedFaq === i && (
                  <div style={{ padding: '0 20px 18px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#00C896', flexShrink: 0 }}>A</span>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Q&A */}
        {tab === 'qna' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>내 문의 내역</p>
              <button onClick={() => { if (!user) { alert('로그인 후 이용해주세요.'); return; } setShowQnaForm(!showQnaForm); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                <Plus size={14} /> Q&A 등록
              </button>
            </div>

            {/* Q&A 등록 폼 */}
            {showQnaForm && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px', marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>문의 등록</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>상담 분류</label>
                    <select value={qnaForm.category} onChange={e => setQnaForm(f => ({...f, category: e.target.value}))}
                      style={{ width: '100%', padding: '9px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
                      {['건의사항', '신고하기', '서비스 오류'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>제목</label>
                    <input value={qnaForm.title} onChange={e => setQnaForm(f => ({...f, title: e.target.value}))} placeholder="제목을 입력해주세요" style={{ fontSize: 13, padding: '9px 12px', height: 'auto' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>문의내용</label>
                    <textarea value={qnaForm.content} onChange={e => setQnaForm(f => ({...f, content: e.target.value}))} placeholder="문의내용을 입력해주세요"
                      style={{ width: '100%', minHeight: 120, padding: '10px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  {/* 파일 첨부 */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>파일 첨부 <span style={{ fontWeight: 400 }}>(선택)</span></label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>
                        <Paperclip size={13} /> 파일 첨부
                        <input type="file" style={{ display: 'none' }} onChange={e => setAttachedFile(e.target.files?.[0] || null)} />
                      </label>
                      {attachedFile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 8 }}>
                          <span style={{ fontSize: 12, color: '#00C896' }}>{attachedFile.name}</span>
                          <button onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}><X size={12} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button onClick={submitQna} disabled={qnaLoading}
                    style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    {qnaLoading ? '등록 중...' : '등록'}
                  </button>
                  <button onClick={() => { setShowQnaForm(false); setQnaForm({ category: '건의사항', title: '', content: '' }); setAttachedFile(null); }}
                    style={{ padding: '9px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>취소</button>
                </div>
              </div>
            )}

            {/* Q&A 목록 */}
            {!user ? (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px', textAlign: 'center' }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>🔒</p>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>로그인이 필요해요</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Q&A는 로그인 후 이용 가능합니다.</p>
                <a href="/login" style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>로그인하기</a>
              </div>
            ) : qnaList.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>💬</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>문의 내역이 없어요</p>
                <p style={{ fontSize: 13 }}>궁금한 점이 있으시면 Q&A 등록 버튼을 눌러주세요</p>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                      {['번호', '분류', '문의 제목', '등록일', '답변'].map(h => <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {qnaList.map((q, i) => (
                      <tr key={q.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-muted)' }}>{qnaList.length - i}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{q.category}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 600 }}>{q.title}</td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(q.created_at).toLocaleDateString('ko-KR')}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: q.status === '답변완료' ? '#00C896' : '#FFB800', background: q.status === '답변완료' ? 'rgba(0,200,150,0.1)' : 'rgba(255,184,0,0.1)', padding: '3px 8px', borderRadius: 20 }}>
                            {q.status || '답변대기'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
