const express = require('express');
const router = express.Router();
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getCategories,
} = require('../controllers/expenseController');
const { validateExpenseInput } = require('../middleware/validateExpense');

// Summary route (must precede /:id)
router.get('/summary', getExpenseSummary);

// Predefined categories route (must precede /:id)
router.get('/categories', getCategories);

// Main collection routes
router.route('/')
  .get(getAllExpenses)
  .post(validateExpenseInput, createExpense);

// Individual item routes
router.route('/:id')
  .get(getExpenseById)
  .put(validateExpenseInput, updateExpense)
  .delete(deleteExpense);

module.exports = router;
