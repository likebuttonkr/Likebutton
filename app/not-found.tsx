import Link from 'next/link';
import Header from './components/Header';

export default function NotFound() {
  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>😅</div>
          <h1 style={{ fontSize: 64, fontWeight: 900, color: '#FF2D55', marginBottom: 8, lineHeight: 1 }}>404</h1>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>페이지를 찾을 수 없어요</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.7 }}>
            요청하신 페이지가 존재하지 않거나<br />이동되었을 수 있어요.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ padding: '13px 28px', background: 'linear-gradient(135deg,#FF2D55,#FF6B35)', color: 'white', textDecoration: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>
              메인으로 가기
            </Link>
            <Link href="/search" style={{ padding: '13px 28px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none', borderRadius: 10, fontWeight: 600, fontSize: 15 }}>
              인플루언서 찾기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
