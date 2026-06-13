'use client';
import { useEffect, useState } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toastQueue: ToastItem[] = [];
let setToastsGlobal: ((fn: (prev: ToastItem[]) => ToastItem[]) => void) | null = null;
let nextId = 0;

export function showToast(message: string, type: ToastType = 'success') {
  if (setToastsGlobal) {
    const id = nextId++;
    setToastsGlobal(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToastsGlobal!(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  useEffect(() => { setToastsGlobal = setToasts; return () => { setToastsGlobal = null; }; }, []);

  const COLORS = {
    success: { bg: '#00C896', icon: <Check size={15} color="white" /> },
    error:   { bg: '#FF2D55', icon: <X size={15} color="white" /> },
    warning: { bg: '#FFB800', icon: <AlertTriangle size={15} color="white" /> },
    info:    { bg: '#5B8DEF', icon: <Info size={15} color="white" /> },
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
      {toasts.map(toast => {
        const { bg, icon } = COLORS[toast.type];
        return (
          <div key={toast.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', background: 'var(--bg-card)',
            border: `1px solid ${bg}30`, borderLeft: `3px solid ${bg}`,
            borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            fontSize: 14, fontWeight: 500, color: 'var(--text)',
            maxWidth: 320, animation: 'slideInRight 0.3s ease',
            pointerEvents: 'auto', minWidth: 240,
          }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
            <span style={{ flex: 1 }}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
