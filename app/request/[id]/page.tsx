'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getChannelById, YoutubeChannel } from '../../lib/youtube';
import { ArrowLeft, Check } from 'lucide-react';

const AD_TYPES = ['브랜디드', 'PPL', '맞춤형'];

export default function RequestPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [channel, setChannel] = useState<YoutubeChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    projectName: '', releaseDate: '', adTypes: [] as string[],
    budget: '', target: '', keyword: '', productInfo: '',
    pointInfo: '', reference: '', license: false,
  });

  useEffect(() => {
    if (id) getChannelById(id).then(ch => { setChannel(ch); setLoading(false); });
  }, [id]);

  const update = (k: string, v: any) => setForm(f => ({...f, [k]: v}));
  const toggleAdType = (type: string) => {
    setForm(f => ({ ...f, adTypes: f.adTypes.includes(type) ? f.adTypes.filter(t => t !== type) : [...f.adTypes, type] }));
  };

  const handleSubmit = () => {
    if (!form.projectName || !form.releaseDate || form.adTypes.length === 0) {
      alert('필수 항목을 모두 입력해주세요.'); return;
    }
    setSubmitted(true);
  };

  if (submitted) return (
    <div>
      <Header isLoggedIn={true} />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 72, height: 72, background: 'rgba(0,200,150,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Check size={36} color="#00C896" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>광고 요청 완료! 🎉</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            {channel?.title}에게 광고 요청을 보냈어요.<br />
            인플루언서가 수락하면 알림으로 알려드릴게요!
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link href="/mypage" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>마이페이지</Link>
            <Link href="/search" style={{ padding: '12px 24px', background: 'transparent', color: 'var(--text)', textDecoration: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, border: '1px solid var(--border)' }}>다른 인플루언서 보기</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Header isLoggedIn={true} />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <Link href={`/influencer/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 24 }}>
          <ArrowLeft size={16} /> 인플루언서 상세로 돌아가기
        </Link>

        {channel && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
            <img src={channel.thumbnail} alt={channel.title} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 16 }}>{channel.title}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>구독자 {channel.subscriberCount} · 유튜브</p>
            </div>
          </div>
        )}

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>광고 요청하기</h2>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>프로젝트명 *</label>
            <input value={form.projectName} onChange={e => update('projectName', e.target.value)} placeholder="프로젝트명을 입력해주세요" />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>릴리즈 일정 *</label>
            <input type="date" value={form.releaseDate} onChange={e => update('releaseDate', e.target.value)} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>광고 형태 * (중복 선택 가능)</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {AD_TYPES.map(type => (
                <button key={type} onClick={() => toggleAdType(type)}
                  style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, borderColor: form.adTypes.includes(type) ? '#FF2D55' : 'var(--border)', background: form.adTypes.includes(type) ? 'rgba(255,45,85,0.1)' : 'transparent', color: form.adTypes.includes(type) ? '#FF2D55' : 'var(--text-muted)' }}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>예상 광고비</label>
            <input value={form.budget} onChange={e => update('budget', e.target.value)} placeholder="예: 5,000,000원 이상" />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>타겟층</label>
            <input value={form.target} onChange={e => update('target', e.target.value)} placeholder="예: 20~30대 여성" />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>대표 키워드</label>
            <input value={form.keyword} onChange={e => update('keyword', e.target.value)} placeholder="예: 뷰티, 립스틱, 신제품" />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>서비스/제품 정보</label>
            <textarea value={form.productInfo} onChange={e => update('productInfo', e.target.value)}
              placeholder="광고할 서비스나 제품에 대해 설명해주세요"
              style={{ width: '100%', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '12px', fontSize: 13, resize: 'vertical', minHeight: 80, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>소구 포인트</label>
            <textarea value={form.pointInfo} onChange={e => update('pointInfo', e.target.value)}
              placeholder="강조하고 싶은 핵심 메시지를 입력해주세요"
              style={{ width: '100%', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '12px', fontSize: 13, resize: 'vertical', minHeight: 80, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>레퍼런스</label>
            <input value={form.reference} onChange={e => update('reference', e.target.value)} placeholder="https://www.example.com" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={form.license} onChange={e => update('license', e.target.checked)} style={{ width: 15, height: 15 }} />
              2차 라이선스 구매 여부 (SNS 광고 등 추가 활용)
            </label>
          </div>

          <button onClick={handleSubmit}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF2D55, #FF6B35)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            광고 요청하기
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
