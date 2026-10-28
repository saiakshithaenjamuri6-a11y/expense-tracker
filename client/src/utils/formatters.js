/**
 * Utilities for formatting currency, dates, and category metadata
 */

/**
 * Format a numeric amount to Indian Rupee (₹) format
 * e.g., 12500 -> ₹12,500.00
 */
export const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

/**
 * Format an ISO date string to a human-readable format
 * e.g., "2026-10-24T00:00:00.000Z" -> "24 Oct 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Convert an ISO date string or Date object into YYYY-MM-DD for <input type="date" />
 */
export const formatDateForInput = (dateValue) => {
  if (!dateValue) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

/**
 * Category color scheme mapping (modern slate-accented palette)
 */
export const CATEGORY_COLORS = {
  Food: {
    bg: '#ecfdf5',
    text: '#065f46',
    border: '#a7f3d0',
    accent: '#10b981',
  },
  Travel: {
    bg: '#f0f9ff',
    text: '#075985',
    border: '#bae6fd',
    accent: '#0284c7',
  },
  Shopping: {
    bg: '#f5f3ff',
    text: '#5b21b6',
    border: '#ddd6fe',
    accent: '#8b5cf6',
  },
  Bills: {
    bg: '#fffbeb',
    text: '#92400e',
    border: '#fde68a',
    accent: '#f59e0b',
  },
  Education: {
    bg: '#eef2ff',
    text: '#3730a3',
    border: '#c7d2fe',
    accent: '#4f46e5',
  },
  Healthcare: {
    bg: '#fef2f2',
    text: '#991b1b',
    border: '#fecaca',
    accent: '#ef4444',
  },
  Entertainment: {
    bg: '#fdf2f8',
    text: '#831843',
    border: '#fbcfe8',
    accent: '#ec4899',
  },
  Other: {
    bg: '#f8fafc',
    text: '#334155',
    border: '#e2e8f0',
    accent: '#64748b',
  },
};

export const DEFAULT_CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Education',
  'Healthcare',
  'Entertainment',
  'Other',
];
