import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '라이크버튼 - 인플루언서 마케팅 플랫폼',
  description: '유튜브·인스타그램·틱톡 인플루언서를 한 곳에서 찾고, 계약하고, 관리하세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
