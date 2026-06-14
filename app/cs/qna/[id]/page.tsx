'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Check } from 'lucide-react';

export default function QnaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [qna, setQna] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const { data } = await supabase.from('qna').select('*').eq('id', id).single();
      setQna(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div><Header /><div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-muted)' }}>로딩 중...</p></div></div>;

  if (!qna) return (
    <div><Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 36 }}>😅</p>
        <p style={{ color: 'var(--text-muted)' }}>문의를 찾을 수 없어요</p>
        <Link href="/cs" style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 700 }}>고객센터로</Link>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: isMobile ? '16px' : '32px 24px' }}>
        <Link href="/cs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, marginBottom: 24, fontWeight: 500 }}>
          <ArrowLeft size={15} /> 고객센터로 돌아가기
        </Link>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, background: 'rgba(255,45,85,0.1)', color: '#FF2D55', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{qna.category}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: qna.answer ? '#00C896' : '#FFB800', background: qna.answer ? 'rgba(0,200,150,0.1)' : 'rgba(255,184,0,0.1)', padding: '3px 10px', borderRadius: 20 }}>
              {qna.answer ? '✓ 답변완료' : '답변대기'}
            </span>
          </div>
          <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, marginBottom: 8 }}>{qna.title}</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            {new Date(qna.created_at).toLocaleString('ko-KR')}
          </p>
          <div style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '16px' }}>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{qna.content}</p>
          </div>
          {qna.file_url && (
            <div style={{ marginTop: 12 }}>
              <a href={qna.file_url} target="_blank" rel="noreferrer"
                style={{ fontSize: 12, color: '#5B8DEF', textDecoration: 'none', fontWeight: 600 }}>
                📎 첨부파일 보기
              </a>
            </div>
          )}
        </div>

        {qna.answer ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 14, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,200,150,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={14} color="#00C896" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#00C896' }}>라이크버튼 답변</p>
            </div>
            <div style={{ background: 'rgba(0,200,150,0.04)', borderRadius: 10, padding: '16px', borderLeft: '3px solid #00C896' }}>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{qna.answer}</p>
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: 32, marginBottom: 10 }}>⏳</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>답변 대기 중이에요</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>영업일 기준 1~3일 내에 답변드립니다</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
