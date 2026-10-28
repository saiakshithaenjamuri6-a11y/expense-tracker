import React from 'react';
import { Pencil, Trash2, Receipt, PlusCircle } from 'lucide-react';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/formatters';

export default function ExpenseTable({
  expenses = [],
  isLoading,
  onEdit,
  onDelete,
  onOpenAddModal,
  isFiltered,
}) {
  if (isLoading) {
    return (
      <div className="table-card">
        <div className="state-container">
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid var(--border-subtle)',
              borderTopColor: 'var(--primary-600)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p className="state-title" style={{ marginTop: '12px', fontSize: '0.95rem' }}>
            Loading expenses...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="table-card">
        <div className="state-container">
          <div className="state-icon-box">
            <Receipt size={28} />
          </div>
          {isFiltered ? (
            <>
              <h3 className="state-title">No matching expenses found</h3>
              <p className="state-desc">
                No expense entries match your current search and category criteria. Try adjusting or
                clearing the filters.
              </p>
            </>
          ) : (
            <>
              <h3 className="state-title">No expenses recorded yet</h3>
              <p className="state-desc">
                Your expense list is empty. Click the button below to add your first transaction.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOpenAddModal}
                style={{ marginTop: '8px' }}
              >
                <PlusCircle size={16} />
                <span>Add Your First Expense</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'center', width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const colorMeta = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;

              return (
                <tr key={expense._id}>
                  {/* Title */}
                  <td className="expense-title-cell" title={expense.title}>
                    {expense.title}
                  </td>

                  {/* Category */}
                  <td>
                    <span
                      className="badge-category"
                      style={{
                        backgroundColor: colorMeta.bg,
                        color: colorMeta.text,
                        border: `1px solid ${colorMeta.border}`,
                      }}
                    >
                      {expense.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(expense.date)}</td>

                  {/* Amount */}
                  <td style={{ textAlign: 'right' }} className="expense-amount-cell">
                    {formatCurrency(expense.amount)}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'center' }}>
                    <div className="actions-cell" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon edit"
                        onClick={() => onEdit(expense)}
                        title={`Edit "${expense.title}"`}
                        aria-label={`Edit ${expense.title}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon delete"
                        onClick={() => onDelete(expense)}
                        title={`Delete "${expense.title}"`}
                        aria-label={`Delete ${expense.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
