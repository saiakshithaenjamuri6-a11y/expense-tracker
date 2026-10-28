import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function DeleteModal({
  isOpen,
  expense,
  onClose,
  onConfirm,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  if (!isOpen || !expense) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onConfirm(expense._id);
      onClose();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete expense. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h2 className="modal-title">Delete Expense</h2>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {deleteError && (
            <div
              className="alert-banner error"
              style={{ marginBottom: '14px', padding: '10px 14px', fontSize: '0.8125rem' }}
            >
              <span>{deleteError}</span>
            </div>
          )}

          <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '16px' }}>
            Are you sure you want to delete this expense record? This action is permanent and cannot
            be undone.
          </p>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {expense.title}
              </span>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {formatCurrency(expense.amount)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Category: {expense.category}</span>
              <span>Date: {formatDate(expense.date)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
            id="confirm-delete-btn"
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Expense'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
