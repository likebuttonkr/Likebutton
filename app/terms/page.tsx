'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TERMS = {
  service: {
    title: '서비스 이용약관',
    content: `제1조 (목적)
이 약관은 라이크버튼(이하 "회사")이 제공하는 인플루언서 마케팅 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 회사가 제공하는 인플루언서 검색, 광고 매칭, 안전결제 등 제반 서비스를 의미합니다.
② "이용자"란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
③ "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.

제3조 (약관의 게시와 개정)
① 회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
② 회사는 필요한 경우 관련법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.

제4조 (서비스의 제공 및 변경)
① 회사는 다음과 같은 서비스를 제공합니다.
- 인플루언서 검색 및 정보 제공 서비스
- 광고주와 인플루언서 간 매칭 서비스  
- 안전결제 서비스
- 기타 회사가 정하는 서비스

제5조 (서비스 이용요금)
① 회사가 제공하는 서비스는 기본적으로 무료입니다.
② 단, 안전결제 이용 시 거래 금액의 10%가 수수료로 부과됩니다.`,
  },
  privacy: {
    title: '개인정보 취급방침',
    content: `라이크버튼(이하 "회사")은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.

1. 개인정보의 처리 목적
회사는 다음의 목적을 위하여 개인정보를 처리합니다.
- 회원 가입 및 관리
- 서비스 제공 및 계약 이행
- 고객 상담 및 불만 처리
- 마케팅 및 광고 활용 (동의 시)

2. 개인정보의 처리 및 보유 기간
① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
- 회원 가입 및 관리: 회원 탈퇴 시까지

3. 개인정보의 제3자 제공
회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.`,
  },
  finance: {
    title: '전자금융거래 이용약관',
    content: `제1조 (목적)
이 약관은 라이크버튼이 제공하는 전자금융거래 서비스를 이용자가 이용함에 있어 이용자와 라이크버튼 사이의 전자금융거래에 관한 기본적인 사항을 정함을 목적으로 합니다.

제2조 (정의)
이 약관에서 정하는 용어의 정의는 다음과 같습니다.
① "전자금융거래"라 함은 회사가 전자적 장치를 통하여 금융상품 및 서비스를 제공하고, 이용자가 회사의 종사자와 직접 대면하거나 의사소통을 하지 아니하고 자동화된 방식으로 이를 이용하는 거래를 말합니다.
② "접근매체"라 함은 전자금융거래에 있어서 거래지시를 하거나 이용자 및 거래내용의 진실성과 정확성을 확보하기 위하여 사용되는 수단 또는 정보를 말합니다.

제3조 (안전결제 서비스)
① 안전결제 서비스는 광고주가 광고비를 플랫폼에 예치하고, 광고가 완료된 후 인플루언서에게 정산하는 에스크로 방식의 서비스입니다.
② 광고 완료 확인 후 영업일 기준 3-5일 이내에 정산됩니다.`,
  },
};

export default function TermsPage() {
  const [active, setActive] = useState<'service' | 'privacy' | 'finance'>('service');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const term = TERMS[active];

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>
        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 900, marginBottom: 20 }}>약관</h1>
        <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? undefined : '200px 1fr', gap: isMobile ? 0 : 24, alignItems: 'start' }}>
          <div style={isMobile ? {
            display: 'flex', overflowX: 'auto', gap: 6, marginBottom: 14, WebkitOverflowScrolling: 'touch',
          } : { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', position: 'sticky', top: 88 }}>
            {[['service', '서비스 이용약관'], ['privacy', '개인정보 취급방침'], ['finance', '전자금융거래 이용약관']].map(([val, label]) => (
              <button key={val} onClick={() => setActive(val as any)}
                style={isMobile ? {
                  flexShrink: 0, padding: '8px 14px', borderRadius: 20, border: `1px solid ${active === val ? '#FF2D55' : 'var(--border)'}`, background: active === val ? 'rgba(255,45,85,0.1)' : 'var(--bg-card)', color: active === val ? '#FF2D55' : 'var(--text-muted)', fontSize: 12, fontWeight: active === val ? 700 : 400, whiteSpace: 'nowrap', cursor: 'pointer',
                } : { display: 'block', width: '100%', padding: '14px 16px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: active === val ? 700 : 400, background: active === val ? 'rgba(255,45,85,0.08)' : 'transparent', color: active === val ? '#FF2D55' : 'var(--text-muted)', borderLeft: active === val ? '3px solid #FF2D55' : '3px solid transparent', borderBottom: '1px solid var(--border)' }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: isMobile ? '18px' : '28px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>{term.title}</h2>
            <pre style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{term.content}</pre>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
