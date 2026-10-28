import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} color="var(--success-accent)" />
          ) : (
            <AlertCircle size={18} color="var(--danger-accent)" />
          )}

          <div style={{ flex: 1 }}>
            <p className="toast-message">{toast.message}</p>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={() => onDismiss(toast.id)}
            style={{ padding: '2px' }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
