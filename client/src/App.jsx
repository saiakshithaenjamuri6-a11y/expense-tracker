import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import CategoryChart from './components/CategoryChart';
import FilterBar from './components/FilterBar';
import ExpenseTable from './components/ExpenseTable';
import ExpenseModal from './components/ExpenseModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import { api } from './services/api';
import { DEFAULT_CATEGORIES } from './utils/formatters';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  // Application Data States
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    transactionCount: 0,
    highestCategory: null,
    categorySummary: [],
  });
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  // Status & Connectivity States
  const [isLoading, setIsLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal Dialog States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * Load dashboard data (expenses list, summary, categories, db health)
   */
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Check server & db health
      const healthRes = await api.getHealth().catch(() => null);
      const isOnline = Boolean(healthRes && healthRes.database && healthRes.database.connected);
      setIsDbConnected(isOnline);

      if (!isOnline) {
        setErrorMessage(
          'Database connection is unavailable. Ensure MongoDB is running and MONGODB_URI in your .env file is correct.'
        );
        setIsLoading(false);
        return;
      }

      // 2. Fetch expenses and summary concurrently
      const [expensesRes, summaryRes, categoriesRes] = await Promise.all([
        api.getExpenses(),
        api.getSummary(),
        api.getCategories().catch(() => ({ data: DEFAULT_CATEGORIES })),
      ]);

      if (expensesRes && expensesRes.data) {
        setExpenses(expensesRes.data);
      }

      if (summaryRes && summaryRes.data) {
        setSummary(summaryRes.data);
      }

      if (categoriesRes && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setIsDbConnected(false);
      setErrorMessage(
        err.message || 'Failed to load expenses from server. Please verify backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Create or Update Expense
  const handleSaveExpense = async (formData) => {
    try {
      if (expenseToEdit) {
        // Update existing
        const res = await api.updateExpense(expenseToEdit._id, formData);
        addToast(res.message || 'Expense updated successfully', 'success');
      } else {
        // Create new
        const res = await api.createExpense(formData);
        addToast(res.message || 'Expense added successfully', 'success');
      }

      // Immediately refresh dashboard data from database source of truth
      await loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to save expense', 'error');
      throw err; // rethrow to keep modal open and display validation errors
    }
  };

  // Handle Delete Expense
  const handleConfirmDelete = async (id) => {
    try {
      const res = await api.deleteExpense(id);
      addToast(res.message || 'Expense deleted successfully', 'success');
      await loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to delete expense', 'error');
      throw err;
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (expense) => {
    setExpenseToEdit(expense);
    setIsFormModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setExpenseToEdit(null);
    setIsFormModalOpen(true);
  };

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchTerm.trim() === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [expenses, selectedCategory, searchTerm]);

  // Filtered total amount calculation
  const filteredTotalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredExpenses]);

  const isFiltered = searchTerm.trim() !== '' || selectedCategory !== 'All';

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <div>
      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        dbConnected={isDbConnected}
      />

      <main className="app-container">
        {/* Error / DB Connection Banner */}
        {errorMessage && (
          <div className="alert-banner error" style={{ marginTop: '20px' }}>
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', marginBottom: '2px' }}>
                Connection Notice
              </strong>
              <p style={{ fontSize: '0.875rem' }}>{errorMessage}</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadDashboardData}
              style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 1. Summary Cards (Total Expenses, Transactions, Top Category, Avg Expense) */}
        <SummaryCards summary={summary} />

        {/* 2. Category Breakdown Chart & Progress */}
        <CategoryChart
          categorySummary={summary.categorySummary}
          totalAmount={summary.totalAmount}
          allCategories={categories}
        />

        {/* 3. Filter Toolbar & Search */}
        <div style={{ marginTop: '24px', marginBottom: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <h2 className="section-title">Transactions & Records</h2>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Total: {expenses.length} {expenses.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            onResetFilters={handleResetFilters}
            isFiltered={isFiltered}
            totalItemsCount={expenses.length}
            filteredItemsCount={filteredExpenses.length}
            filteredTotalAmount={filteredTotalAmount}
          />
        </div>

        {/* 4. Expenses Table */}
        <ExpenseTable
          expenses={filteredExpenses}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={(expense) => setExpenseToDelete(expense)}
          onOpenAddModal={handleOpenAddModal}
          isFiltered={isFiltered}
        />
      </main>

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isFormModalOpen}
        expenseToEdit={expenseToEdit}
        categories={categories}
        onClose={() => {
          setIsFormModalOpen(false);
          setExpenseToEdit(null);
        }}
        onSubmit={handleSaveExpense}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(expenseToDelete)}
        expense={expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
