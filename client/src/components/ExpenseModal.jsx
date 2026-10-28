import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { DEFAULT_CATEGORIES, formatDateForInput } from '../utils/formatters';

export default function ExpenseModal({
  isOpen,
  expenseToEdit,
  categories = DEFAULT_CATEGORIES,
  onClose,
  onSubmit,
}) {
  const isEditMode = Boolean(expenseToEdit);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: formatDateForInput(new Date()),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Sync form state when modal opens or expenseToEdit changes
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || '',
        amount: expenseToEdit.amount !== undefined ? String(expenseToEdit.amount) : '',
        category: expenseToEdit.category || 'Food',
        date: formatDateForInput(expenseToEdit.date),
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: formatDateForInput(new Date()),
      });
    }
    setErrors({});
    setServerError(null);
    setIsSubmitting(false);
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    // Amount validation
    if (!formData.amount || String(formData.amount).trim() === '') {
      newErrors.amount = 'Amount is required';
    } else {
      const parsedAmount = Number(formData.amount);
      if (isNaN(parsedAmount)) {
        newErrors.amount = 'Amount must be a valid number';
      } else if (parsedAmount <= 0) {
        newErrors.amount = 'Amount must be greater than zero';
      }
    }

    // Category validation
    if (!formData.category || !categories.includes(formData.category)) {
      newErrors.category = 'Please select a valid category';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const parsedDate = new Date(formData.date);
      if (isNaN(parsedDate.getTime())) {
        newErrors.date = 'Please enter a valid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        title: formData.title.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      // Show backend error message or validation list
      if (err.errors && err.errors.length > 0) {
        const fieldErrors = {};
        err.errors.forEach((eItem) => {
          if (eItem.field) fieldErrors[eItem.field] = eItem.message;
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
      setServerError(err.message || 'Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && (
              <div
                className="alert-banner error"
                style={{ marginBottom: '16px', padding: '10px 14px', fontSize: '0.8125rem' }}
              >
                <span>{serverError}</span>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-title">
                Expense Title <span style={{ color: 'var(--danger-accent)' }}>*</span>
              </label>
              <input
                id="expense-title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g., Grocery at Supermarket"
                value={formData.title}
                onChange={handleChange}
                autoFocus
              />
              {errors.title && <p className="form-error-msg">{errors.title}</p>}
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-amount">
                Amount (₹) <span style={{ color: 'var(--danger-accent)' }}>*</span>
              </label>
              <div className="input-with-prefix">
                <span className="input-prefix">₹</span>
                <input
                  id="expense-amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className={`form-input ${errors.amount ? 'error' : ''}`}
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
              {errors.amount && <p className="form-error-msg">{errors.amount}</p>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-category">
                Category <span style={{ color: 'var(--danger-accent)' }}>*</span>
              </label>
              <select
                id="expense-category"
                name="category"
                className={`form-input ${errors.category ? 'error' : ''}`}
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="form-error-msg">{errors.category}</p>}
            </div>

            {/* Date */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="expense-date">
                Date <span style={{ color: 'var(--danger-accent)' }}>*</span>
              </label>
              <input
                id="expense-date"
                name="date"
                type="date"
                className={`form-input ${errors.date ? 'error' : ''}`}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <p className="form-error-msg">{errors.date}</p>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="submit-expense-btn"
            >
              <Check size={16} />
              <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Expense' : 'Add Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
