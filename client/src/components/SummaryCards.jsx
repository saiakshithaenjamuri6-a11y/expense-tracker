import React from 'react';
import { IndianRupee, ReceiptText, TrendingUp, CircleDollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function SummaryCards({ summary }) {
  const {
    totalAmount = 0,
    transactionCount = 0,
    highestCategory = null,
  } = summary || {};

  const avgExpense = transactionCount > 0 ? totalAmount / transactionCount : 0;

  return (
    <section className="summary-grid" aria-label="Expense Summary">
      {/* 1. Total Expenses */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-title">Total Expenses</span>
          <div className="summary-icon-box icon-indigo">
            <IndianRupee size={20} />
          </div>
        </div>
        <div className="summary-card-value">{formatCurrency(totalAmount)}</div>
        <div className="summary-card-subtext">
          <span>Across all recorded transactions</span>
        </div>
      </div>

      {/* 2. Total Transactions */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-title">Transactions</span>
          <div className="summary-icon-box icon-emerald">
            <ReceiptText size={20} />
          </div>
        </div>
        <div className="summary-card-value">{transactionCount}</div>
        <div className="summary-card-subtext">
          <span>{transactionCount === 1 ? '1 entry' : `${transactionCount} entries recorded`}</span>
        </div>
      </div>

      {/* 3. Highest Spending Category */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-title">Top Category</span>
          <div className="summary-icon-box icon-amber">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="summary-card-value">
          {highestCategory ? highestCategory.category : '—'}
        </div>
        <div className="summary-card-subtext">
          {highestCategory ? (
            <span>
              {formatCurrency(highestCategory.total)} ({highestCategory.percentage}%)
            </span>
          ) : (
            <span>No expenses recorded</span>
          )}
        </div>
      </div>

      {/* 4. Average Expense */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-title">Avg. Expense</span>
          <div className="summary-icon-box icon-purple">
            <CircleDollarSign size={20} />
          </div>
        </div>
        <div className="summary-card-value">{formatCurrency(avgExpense)}</div>
        <div className="summary-card-subtext">
          <span>Per transaction average</span>
        </div>
      </div>
    </section>
  );
}
