/**
 * API Service for communicating with the Node.js/Express backend.
 * Uses the native Fetch API with configurable BASE_URL.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Helper to process Fetch responses and normalize errors
 */
async function handleResponse(response) {
  let json;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const error = new Error(
      (json && json.message) || `HTTP error! Status: ${response.status}`
    );
    error.status = response.status;
    error.errors = (json && json.errors) || [];
    error.code = json && json.error;
    throw error;
  }

  return json;
}

/**
 * Handle network or offline errors gracefully
 */
function handleNetworkError(err) {
  if (err.status) {
    // Already an HTTP error
    throw err;
  }
  const networkErr = new Error(
    'Unable to reach the backend server. Please verify the server is running on http://localhost:5000.'
  );
  networkErr.isNetworkError = true;
  throw networkErr;
}

export const api = {
  /**
   * Health check
   */
  async getHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      return await handleResponse(res);
    } catch (err) {
      return handleNetworkError(err);
    }
  },

  /**
   * Get all expenses (supports category and search query filters)
   */
  async getExpenses({ category, search } = {}) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (search && search.trim()) params.append('search', search.trim());

      const url = `${BASE_URL}/expenses${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      return await handleResponse(res);
    } catch (err) {
      return handleNetworkError(err);
    }
  },

  /**
   * Get single expense by ID
   */
  async getExpenseById(id) {
    try {
      const res = await fetch(`${BASE_URL}/expenses/${id}`);
      return await handleResponse(res);
    } catch (err) {
      return handleNetworkError(err);
    }
  },

  /**
   * Create a new expense
   */
  async createExpense(expenseData) {
    try {
      const res = await fetch(`${BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
      return await handleResponse(res);
    } catch (err) {
      return handleNetworkError(err);
    }
  },

  /**
   * Update an existing expense by ID
   */
  async updateExpense(id, expenseData) {
    try {
      const res = await fetch(`${BASE_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
      return await handleResponse(res);
    } catch (err) {
      return handleNetworkError(err);
    }
  },

  /**
   * Delete an expense by ID
   */
  async deleteExpense(id) {
    try {
      const res = await fetch(`${BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      return await handleResponse(res);
    } catch (err) {
      return handleNetworkError(err);
    }
  },

  /**
   * Fetch aggregate summary (total, count, highest category, category breakdown)
   */
  async getSummary() {
    try {
      const res = await fetch(`${BASE_URL}/expenses/summary`);
      return await handleResponse(res);
    } catch (err) {
      return handleNetworkError(err);
    }
  },

  /**
   * Fetch list of predefined categories
   */
  async getCategories() {
    try {
      const res = await fetch(`${BASE_URL}/expenses/categories`);
      return await handleResponse(res);
    } catch (err) {
      return handleNetworkError(err);
    }
  },
};
