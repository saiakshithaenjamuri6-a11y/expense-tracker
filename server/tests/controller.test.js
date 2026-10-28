const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getCategories,
} = require('../controllers/expenseController');
const { Expense, CATEGORIES } = require('../models/Expense');

describe('Expense Controller - Calculations & Logic Tests', () => {
  it('getCategories should return the 8 standard categories', () => {
    let responseData = null;
    let statusCode = 0;

    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
        };
      },
    };

    getCategories({}, res);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.data.length, 8);
    assert.ok(responseData.data.includes('Food'));
    assert.ok(responseData.data.includes('Travel'));
    assert.ok(responseData.data.includes('Bills'));
  });

  it('getExpenseById should return 400 for malformed ID', async () => {
    let responseData = null;
    let statusCode = 0;

    const req = { params: { id: 'invalid-id-123' } };
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
        };
      },
    };

    await getExpenseById(req, res, () => {});
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseData.success, false);
    assert.ok(responseData.message.includes('Invalid expense ID format'));
  });

  it('updateExpense should return 400 for malformed ID', async () => {
    let responseData = null;
    let statusCode = 0;

    const req = {
      params: { id: '123' },
      body: { title: 'Test', amount: 100, category: 'Food', date: new Date() },
    };
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
        };
      },
    };

    await updateExpense(req, res, () => {});
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseData.success, false);
  });

  it('deleteExpense should return 400 for malformed ID', async () => {
    let responseData = null;
    let statusCode = 0;

    const req = { params: { id: 'invalid' } };
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
        };
      },
    };

    await deleteExpense(req, res, () => {});
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseData.success, false);
  });

  it('getExpenseSummary should handle empty database records gracefully', async () => {
    // Temporarily mock Expense.aggregate to simulate empty database
    const originalAggregate = Expense.aggregate;
    Expense.aggregate = async () => [];

    let responseData = null;
    let statusCode = 0;

    const req = {};
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
        };
      },
    };

    await getExpenseSummary(req, res, () => {});

    // Restore original method
    Expense.aggregate = originalAggregate;

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.data.totalAmount, 0);
    assert.strictEqual(responseData.data.transactionCount, 0);
    assert.strictEqual(responseData.data.highestCategory, null);
    assert.deepStrictEqual(responseData.data.categorySummary, []);
  });

  it('getExpenseSummary should calculate totals, percentages, and highest category accurately', async () => {
    // Mock Expense.aggregate to simulate populated database
    const originalAggregate = Expense.aggregate;
    Expense.aggregate = async (pipeline) => {
      // Check if this is the category aggregation or overall totals aggregation
      if (pipeline[0].$group._id === '$category') {
        return [
          { _id: 'Food', total: 6000, count: 3 },
          { _id: 'Travel', total: 3000, count: 2 },
          { _id: 'Bills', total: 1000, count: 1 },
        ];
      }
      return [{ _id: null, totalAmount: 10000, transactionCount: 6 }];
    };

    let responseData = null;
    let statusCode = 0;

    const req = {};
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
          },
        };
      },
    };

    await getExpenseSummary(req, res, () => {});

    // Restore original method
    Expense.aggregate = originalAggregate;

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.data.totalAmount, 10000);
    assert.strictEqual(responseData.data.transactionCount, 6);

    // Highest category check
    assert.strictEqual(responseData.data.highestCategory.category, 'Food');
    assert.strictEqual(responseData.data.highestCategory.total, 6000);
    assert.strictEqual(responseData.data.highestCategory.percentage, 60);

    // Category breakdown check
    assert.strictEqual(responseData.data.categorySummary.length, 3);
    assert.strictEqual(responseData.data.categorySummary[0].category, 'Food');
    assert.strictEqual(responseData.data.categorySummary[0].percentage, 60);
    assert.strictEqual(responseData.data.categorySummary[1].category, 'Travel');
    assert.strictEqual(responseData.data.categorySummary[1].percentage, 30);
    assert.strictEqual(responseData.data.categorySummary[2].category, 'Bills');
    assert.strictEqual(responseData.data.categorySummary[2].percentage, 10);
  });
});
