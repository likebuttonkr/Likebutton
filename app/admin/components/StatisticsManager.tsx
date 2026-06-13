'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function StatisticsManager() {
  const [stats, setStats] = useState<any>({});
  const [metric, setMetric] = useState('전체 회원 수');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [{ data: profiles }, { data: services }, { data: projects }, { data: qna }, { data: withdrawals }, { data: payments }] = await Promise.all([
      supabase.from('profiles').select('user_type, approval_status, account_status, created_at'),
      supabase.from('services').select('platform, status, created_at'),
      supabase.from('projects').select('platform, status, budget, created_at'),
      supabase.from('qna').select('status, created_at'),
      supabase.from('withdrawals').select('amount, status, created_at'),
      supabase.from('payments').select('amount, status, created_at'),
    ]);

    const inf = (profiles || []).filter(p => p.user_type === 'influencer');
    const adv = (profiles || []).filter(p => p.user_type === 'advertiser');

    setStats({
      '전체 회원 수': (profiles || []).length,
      '인플루언서 정상 수': inf.filter(p => !p.account_status || p.account_status === '정상').length,
      '인플루언서 제재 수': inf.filter(p => p.account_status === '제재').length,
      '인플루언서 탈퇴 수': inf.filter(p => p.account_status === '탈퇴').length,
      '광고주 정상 수': adv.filter(p => !p.account_status || p.account_status === '정상').length,
      '광고주 승인대기 수': adv.filter(p => !p.approval_status || p.approval_status === '승인대기').length,
      '광고주 승인완료 수': adv.filter(p => p.approval_status === '승인완료').length,
      '광고주 승인거절 수': adv.filter(p => p.approval_status === '승인거절').length,
      '전체 서비스 수': (services || []).length,
      '유튜브 서비스 수': (services || []).filter(s => s.platform === 'youtube').length,
      '인스타그램 서비스 수': (services || []).filter(s => s.platform === 'instagram').length,
      '틱톡 서비스 수': (services || []).filter(s => s.platform === 'tiktok').length,
      '전체 프로젝트 수': (projects || []).length,
      '프로젝트 진행 수': (projects || []).filter(p => !['광고 완료', '광고 취소'].includes(p.status)).length,
      '프로젝트 완료 수': (projects || []).filter(p => p.status === '광고 완료').length,
      '미답변 Q&A 수': (qna || []).filter(q => q.status === '답변대기').length,
      'Q&A 수': (qna || []).length,
      '출금 신청 금액': (withdrawals || []).filter(w => w.status !== '출금 완료').reduce((s, w) => s + (w.amount || 0), 0),
      '출금 완료 금액': (withdrawals || []).filter(w => w.status === '출금 완료').reduce((s, w) => s + (w.amount || 0), 0),
      '전체 결제 금액': (payments || []).reduce((s, p) => s + (p.amount || 0), 0),
    });
    setLoading(false);
  };

  const METRICS = Object.keys(stats);
  const isMoney = metric.includes('금액');

  const SUMMARY_CARDS = [
    { label: '전체 회원', value: stats['전체 회원 수'], icon: '👥', color: '#5B8DEF' },
    { label: '인플루언서', value: stats['인플루언서 정상 수'], icon: '🎬', color: '#FF2D55' },
    { label: '광고주', value: stats['광고주 승인완료 수'], icon: '🏢', color: '#FFB800' },
    { label: '전체 프로젝트', value: stats['전체 프로젝트 수'], icon: '📋', color: '#00C896' },
    { label: '미답변 Q&A', value: stats['미답변 Q&A 수'], icon: '💬', color: '#8B5CF6' },
    { label: '출금 신청', value: stats['출금 신청 금액'], icon: '💰', color: '#FF6B35', isMoney: true },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>로딩 중...</div>;

  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>통계</h2>

      {/* 요약 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
        {SUMMARY_CARDS.map(card => (
          <div key={card.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{card.icon}</span>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{card.label}</p>
            </div>
            <p style={{ fontSize: 20, fontWeight: 900, color: card.color }}>
              {card.isMoney ? `${(card.value || 0).toLocaleString()}원` : (card.value || 0).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* 상세 통계 */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>상세 통계</h3>
          <select value={metric} onChange={e => setMetric(e.target.value)}
            style={{ padding: '6px 12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
            {METRICS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div style={{ textAlign: 'center', padding: '32px 20px' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>{metric}</p>
          <p style={{ fontSize: 48, fontWeight: 900, color: '#FF2D55' }}>
            {isMoney ? `${(stats[metric] || 0).toLocaleString()}원` : (stats[metric] || 0).toLocaleString()}
          </p>
        </div>

        {/* 전체 데이터 테이블 */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)' }}>전체 지표</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {METRICS.map(m => (
              <div key={m} onClick={() => setMetric(m)}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: m === metric ? 'rgba(255,45,85,0.08)' : 'var(--bg-card2)', border: `1px solid ${m === metric ? 'rgba(255,45,85,0.3)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer' }}>
                <span style={{ fontSize: 12, color: m === metric ? '#FF2D55' : 'var(--text-muted)' }}>{m}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: m === metric ? '#FF2D55' : 'var(--text)' }}>
                  {m.includes('금액') ? `${(stats[m] || 0).toLocaleString()}원` : (stats[m] || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
