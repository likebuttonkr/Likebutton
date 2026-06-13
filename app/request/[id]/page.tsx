'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getChannelById, YoutubeChannel } from '../../lib/youtube';
import { ArrowLeft, Check, Plus, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const AD_TYPES = [
  { type: '브랜디드', price: 4000000, desc: '영상 전체가 브랜드 광고 콘텐츠' },
  { type: 'PPL', price: 2000000, desc: '영상 내 자연스러운 제품 노출' },
  { type: '맞춤형', price: 5000000, desc: '브랜드 맞춤 제작 콘텐츠' },
];

// 달력 컴포넌트
function CalendarPicker({ value, onChange, onClose }: { value: string; onChange: (v: string) => void; onClose: () => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  const selectDate = (day: number) => {
    const d = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(d);
    onClose();
  };

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const selectedParts = value ? value.split('-') : [];
  const isSelected = (day: number) => selectedParts[0] === String(viewYear) && selectedParts[1] === String(viewMonth + 1).padStart(2, '0') && selectedParts[2] === String(day).padStart(2, '0');
  const isPast = (day: number) => new Date(viewYear, viewMonth, day) < today;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={onClose}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', minWidth: 300 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}><ChevronLeft size={18} /></button>
          <p style={{ fontWeight: 800, fontSize: 16 }}>{viewYear}년 {MONTHS[viewMonth]}</p>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6 }}><ChevronRight size={18} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
          {DAYS.map(d => <p key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, padding: '4px 0' }}>{d}</p>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {cells.map((day, i) => (
            <button key={i} onClick={() => day && !isPast(day) && selectDate(day)} disabled={!day || isPast(day)}
              style={{ aspectRatio: '1', borderRadius: 8, border: 'none', cursor: day && !isPast(day) ? 'pointer' : 'default', fontSize: 13, fontWeight: isSelected(day!) ? 700 : 400, background: isSelected(day!) ? '#FF2D55' : 'transparent', color: !day ? 'transparent' : isPast(day) ? 'var(--border)' : isSelected(day!) ? 'white' : 'var(--text)' }}>
              {day || ''}
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ width: '100%', marginTop: 14, padding: '10px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>닫기</button>
      </div>
    </div>
  );
}

export default function RequestPage() {
  const { id } = useParams<{ id: string }>();
  const [channel, setChannel] = useState<YoutubeChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [form, setForm] = useState({
    projectName: '',
    releaseDate: '',
    adTypes: [] as string[],
    target: '',
    keyword: '',
    productInfo: '',
    pointInfo: '',
    references: [''],
    license: '예', // 예/아니요
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (id) getChannelById(id).then(ch => { setChannel(ch); setLoading(false); });
  }, [id]);

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleAdType = (type: string) => {
    setForm(f => ({ ...f, adTypes: f.adTypes.includes(type) ? f.adTypes.filter(t => t !== type) : [...f.adTypes, type] }));
  };

  const updateReference = (idx: number, val: string) => {
    const refs = [...form.references];
    refs[idx] = val;
    setForm(f => ({ ...f, references: refs }));
  };

  const addReference = () => setForm(f => ({ ...f, references: [...f.references, ''] }));
  const removeReference = (idx: number) => {
    if (form.references.length === 1) {
      setForm(f => ({ ...f, references: [''] }));
    } else {
      setForm(f => ({ ...f, references: f.references.filter((_, i) => i !== idx) }));
    }
  };

  // 예상 광고비 자동 계산
  const selectedAdPrices = AD_TYPES.filter(a => form.adTypes.includes(a.type));
  const totalEstimate = selectedAdPrices.reduce((sum, a) => sum + a.price, 0);
  const estimateText = selectedAdPrices.length > 0
    ? `${selectedAdPrices.map(a => `${a.type}(${a.price.toLocaleString()})`).join(' + ')} = 총 예상 광고비 ${totalEstimate.toLocaleString()}원`
    : '';

  const handleSubmit = async () => {
    if (!form.projectName || !form.releaseDate || form.adTypes.length === 0) {
      alert('프로젝트명, 릴리즈 일정, 광고 형태는 필수 항목입니다.'); return;
    }
    try {
      const { supabase } = await import('../../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('projects').insert({
          title: form.projectName,
          advertiser_id: session.user.id,
          influencer_id: id,
          platform: 'youtube',
          ad_type: form.adTypes.join(', '),
          budget: totalEstimate,
          status: '광고 요청',
          target: form.target,
          keyword: form.keyword,
          product_info: form.productInfo,
          release_date: form.releaseDate,
        });
      }
    } catch (e) {}
    setSubmitted(true);
  };

  // 완료 화면
  if (submitted) return (
    <div>
      <Header isLoggedIn={true} />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ width: 72, height: 72, background: 'rgba(0,200,150,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>광고 요청 완료!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
            <strong>{channel?.title}</strong>님에게 광고 요청이 접수되었습니다.<br />
            인플루언서가 수락하면 알림으로 알려드릴게요!
          </p>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', marginBottom: 24, textAlign: 'left' }}>
            {[
              { label: '프로젝트명', value: form.projectName },
              { label: '릴리즈 일정', value: form.releaseDate },
              { label: '광고 형태', value: form.adTypes.join(', ') },
              { label: '예상 광고비', value: totalEstimate > 0 ? `${totalEstimate.toLocaleString()}원 이상` : '-' },
              { label: '타겟층', value: form.target || '-' },
            ].map(info => (
              <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{info.label}</span>
                <span style={{ fontWeight: 600 }}>{info.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link href="/mypage" style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>프로젝트 관리</Link>
            <Link href="/search" style={{ padding: '12px 24px', background: 'transparent', color: 'var(--text)', textDecoration: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, border: '1px solid var(--border)' }}>다른 인플루언서 보기</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Header isLoggedIn={true} />
      {showCalendar && (
        <CalendarPicker value={form.releaseDate} onChange={v => update('releaseDate', v)} onClose={() => setShowCalendar(false)} />
      )}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>
        <Link href={`/influencer/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 24 }}>
          <ArrowLeft size={15} /> 인플루언서 상세로 돌아가기
        </Link>

        {/* 인플루언서 정보 */}
        {channel && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
            <img src={channel.thumbnail} alt={channel.title} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 16 }}>{channel.title}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>구독자 {channel.subscriberCount} · ⭐ {channel.rating} · 유튜브</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: 20, alignItems: 'start' }}>
          {/* 폼 영역 */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: isMobile ? '20px' : '28px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>광고 요청</h2>

            {/* 프로젝트명 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>프로젝트명 *</label>
              <input value={form.projectName} onChange={e => update('projectName', e.target.value)} placeholder="프로젝트명을 입력해주세요" />
            </div>

            {/* 릴리즈 일정 - 달력 팝업 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>릴리즈 일정 *</label>
              <button onClick={() => setShowCalendar(true)}
                style={{ width: '100%', padding: '11px 14px', background: 'var(--bg-card2)', border: `1px solid ${form.releaseDate ? '#FF2D55' : 'var(--border)'}`, borderRadius: 8, color: form.releaseDate ? 'var(--text)' : 'var(--text-muted)', fontSize: 14, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{form.releaseDate || '날짜를 선택해주세요'}</span>
                <Calendar size={16} color="var(--text-muted)" />
              </button>
            </div>

            {/* 광고 형태 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>광고 형태 * <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>(중복 선택 가능)</span></label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {AD_TYPES.map(a => (
                  <button key={a.type} onClick={() => toggleAdType(a.type)}
                    style={{ padding: '9px 18px', borderRadius: 8, border: `1px solid ${form.adTypes.includes(a.type) ? '#FF2D55' : 'var(--border)'}`, cursor: 'pointer', fontSize: 13, fontWeight: 600, background: form.adTypes.includes(a.type) ? 'rgba(255,45,85,0.1)' : 'transparent', color: form.adTypes.includes(a.type) ? '#FF2D55' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span>{a.type}</span>
                    <span style={{ fontSize: 11, fontWeight: 400, color: form.adTypes.includes(a.type) ? '#FF6B35' : 'var(--text-muted)' }}>{a.price.toLocaleString()}원~</span>
                  </button>
                ))}
              </div>
              {/* 예상 광고비 자동 계산 */}
              {estimateText && (
                <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: '#FF2D55', fontWeight: 600 }}>💰 {estimateText}</p>
                </div>
              )}
            </div>

            {/* 타겟층 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>타겟층</label>
              <input value={form.target} onChange={e => update('target', e.target.value)} placeholder="예: 20~30대 여성" />
            </div>

            {/* 대표 키워드 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>대표 키워드</label>
              <input value={form.keyword} onChange={e => update('keyword', e.target.value)} placeholder="영상 내 언급되어야 하거나 글로 작성해야 하는 대표 키워드를 입력해주세요" />
            </div>

            {/* 서비스/제품 정보 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>서비스/제품 정보</label>
              <textarea value={form.productInfo} onChange={e => update('productInfo', e.target.value)}
                placeholder="서비스/제품 정보를 입력해주세요"
                style={{ width: '100%', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '11px 12px', fontSize: 13, resize: 'vertical', minHeight: 90, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* 소구 포인트 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>소구 포인트</label>
              <textarea value={form.pointInfo} onChange={e => update('pointInfo', e.target.value)}
                placeholder="필수 소구점을 입력해주세요"
                style={{ width: '100%', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '11px 12px', fontSize: 13, resize: 'vertical', minHeight: 80, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* 레퍼런스 - 추가/삭제 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>레퍼런스</label>
              {form.references.map((ref, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={ref} onChange={e => updateReference(idx, e.target.value)}
                    placeholder="https://www.abc.com/abc"
                    style={{ flex: 1, fontSize: 13 }} />
                  <button onClick={() => removeReference(idx)}
                    style={{ padding: '0 10px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#FF2D55', borderRadius: 8, cursor: 'pointer', flexShrink: 0 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={addReference}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
                <Plus size={13} /> 레퍼런스 추가
              </button>
            </div>

            {/* 2차 라이선스 - 라디오 버튼 */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>2차 라이선스 구매여부</label>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>SNS 광고, 배너 광고 등 추가 활용 여부</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['예', '아니요'].map(opt => (
                  <button key={opt} onClick={() => update('license', opt)}
                    style={{ padding: '9px 24px', borderRadius: 8, border: `2px solid ${form.license === opt ? '#FF2D55' : 'var(--border)'}`, background: form.license === opt ? 'rgba(255,45,85,0.1)' : 'transparent', color: form.license === opt ? '#FF2D55' : 'var(--text-muted)', fontSize: 14, fontWeight: form.license === opt ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {form.license === opt && <span style={{ marginRight: 6 }}>✓</span>}{opt}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              광고 요청하기
            </button>
          </div>

          {/* 우측 요약 사이드바 */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 88 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>요청 요약</h3>
              {[
                { label: '프로젝트명', value: form.projectName || '-' },
                { label: '릴리즈 일정', value: form.releaseDate || '-' },
                { label: '광고 형태', value: form.adTypes.length > 0 ? form.adTypes.join(', ') : '-' },
                { label: '타겟층', value: form.target || '-' },
                { label: '2차 라이선스', value: form.license },
              ].map(info => (
                <div key={info.label} style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 2 }}>{info.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{info.value}</p>
                </div>
              ))}

              {totalEstimate > 0 && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>예상 광고비</p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: '#FF2D55' }}>{totalEstimate.toLocaleString()}원~</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>실제 비용은 협의에 따라 달라질 수 있어요</p>
                </div>
              )}

              <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.2)', borderRadius: 8 }}>
                <p style={{ fontSize: 12, color: '#FFB800', lineHeight: 1.6 }}>⚠️ 광고 요청 후 인플루언서가 수락하면 안전결제가 진행됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
