import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { DEFAULT_CATEGORIES, formatCurrency } from '../utils/formatters';

export default function FilterBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = DEFAULT_CATEGORIES,
  onResetFilters,
  isFiltered,
  totalItemsCount,
  filteredItemsCount,
  filteredTotalAmount,
}) {
  return (
    <div className="toolbar">
      {/* Search by Title */}
      <div className="search-box-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search expenses by title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="btn-icon"
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            title="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter by Category */}
      <div className="filter-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            className="select-input"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {isFiltered && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetFilters}
            style={{ padding: '8px 12px', fontSize: '0.8125rem' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Filtered state badge showing explicit filtered total */}
      {isFiltered && (
        <div className="filter-badge-info" style={{ width: '100%' }}>
          <span>
            Showing <strong>{filteredItemsCount}</strong> of <strong>{totalItemsCount}</strong>{' '}
            expenses
          </span>
          <span style={{ color: 'var(--text-subtle)' }}>•</span>
          <span>
            Filtered Total: <strong>{formatCurrency(filteredTotalAmount)}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
