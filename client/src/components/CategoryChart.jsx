import React, { useMemo } from 'react';
import { PieChart } from 'lucide-react';
import { formatCurrency, CATEGORY_COLORS, DEFAULT_CATEGORIES } from '../utils/formatters';

export default function CategoryChart({
  categorySummary = [],
  totalAmount = 0,
  allCategories = DEFAULT_CATEGORIES,
}) {
  // Merge backend summary with all standard categories so categories like Entertainment and Travel are always shown
  const displaySummary = useMemo(() => {
    const summaryMap = new Map();
    (categorySummary || []).forEach((item) => {
      summaryMap.set(item.category, item);
    });

    // Ensure all standard categories (Food, Travel, Shopping, Bills, Education, Healthcare, Entertainment, Other)
    // are present in the list
    const merged = allCategories.map((catName) => {
      const existing = summaryMap.get(catName);
      if (existing) return existing;
      return {
        category: catName,
        total: 0,
        count: 0,
        percentage: 0,
      };
    });

    // Sort by spending amount descending; zero-spend categories are sorted alphabetically
    return merged.sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }
      return a.category.localeCompare(b.category);
    });
  }, [categorySummary, allCategories]);

  // If there are no expenses at all in the database, display the friendly empty state
  if (totalAmount === 0 && (!categorySummary || categorySummary.length === 0)) {
    return (
      <section className="analytics-section">
        <div className="section-header">
          <h2 className="section-title">Category Breakdown</h2>
        </div>
        <div className="state-container" style={{ padding: '30px 20px' }}>
          <div className="state-icon-box">
            <PieChart size={24} />
          </div>
          <p className="state-title" style={{ fontSize: '0.95rem' }}>
            No category data available
          </p>
          <p className="state-desc" style={{ fontSize: '0.8rem' }}>
            Add expenses to see category-wise distributions and spending charts.
          </p>
        </div>
      </section>
    );
  }

  const activeCategoriesCount = displaySummary.filter((item) => item.total > 0).length;

  return (
    <section className="analytics-section">
      <div className="section-header">
        <h2 className="section-title">Category Breakdown</h2>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {activeCategoriesCount} active spending {activeCategoriesCount === 1 ? 'category' : 'categories'} • {displaySummary.length} total
        </span>
      </div>

      {/* Proportional Segmented Progress Bar */}
      {totalAmount > 0 && (
        <div
          style={{
            display: 'flex',
            height: '14px',
            borderRadius: '9999px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-subtle)',
            marginBottom: '20px',
          }}
          title="Visual category proportion"
        >
          {displaySummary
            .filter((item) => item.total > 0)
            .map((item) => {
              const colorMeta = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
              return (
                <div
                  key={`segment-${item.category}`}
                  style={{
                    width: `${Math.max(item.percentage, 1.5)}%`,
                    backgroundColor: colorMeta.accent,
                    transition: 'width 0.4s ease',
                  }}
                  title={`${item.category}: ${item.percentage}% (${formatCurrency(item.total)})`}
                />
              );
            })}
        </div>
      )}

      {/* Category List with Individual Progress Bars */}
      <div className="category-chart-grid">
        {displaySummary.map((item) => {
          const colorMeta = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;

          return (
            <div key={item.category} className="category-bar-item">
              <div className="category-bar-meta">
                <div className="category-label-group">
                  <span
                    className="category-color-pip"
                    style={{ backgroundColor: colorMeta.accent }}
                  />
                  <span className="category-name">{item.category}</span>
                  <span className="category-count">
                    ({item.count} {item.count === 1 ? 'transaction' : 'transactions'})
                  </span>
                </div>

                <div className="category-amount-group">
                  <span className="category-amount">{formatCurrency(item.total)}</span>
                  <span className="category-percent">{item.percentage}%</span>
                </div>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(item.percentage, 100)}%`,
                    backgroundColor: colorMeta.accent,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
