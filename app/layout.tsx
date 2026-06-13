import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '라이크버튼 - 인플루언서 마케팅 플랫폼',
  description: '유튜브, 인스타그램, 틱톡 인플루언서와 브랜드를 연결하는 국내 최대 인플루언서 마케팅 플랫폼',
  keywords: '인플루언서 마케팅, 유튜버 광고, 인스타그램 광고, 틱톡 광고, 브랜디드 콘텐츠, PPL',
  openGraph: {
    title: '라이크버튼 - 인플루언서 마케팅 플랫폼',
    description: '유튜브, 인스타그램, 틱톡 인플루언서와 브랜드를 연결하는 국내 최대 인플루언서 마케팅 플랫폼',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
