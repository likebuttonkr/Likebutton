'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen, title, message,
  confirmText = '확인', cancelText = '취소',
  confirmColor = '#FF2D55',
  onConfirm, onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={onCancel}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px', width: '100%', maxWidth: 380, textAlign: 'center' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 36, marginBottom: 14 }}>
          {confirmColor === '#FF2D55' ? '🗑️' : '✅'}
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: '12px', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            {cancelText}
          </button>
          <button onClick={onConfirm}
            style={{ flex: 1, padding: '12px', background: confirmColor, border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
