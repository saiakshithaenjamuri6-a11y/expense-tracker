const { CATEGORIES } = require('../models/Expense');

/**
 * Validates request body for POST /api/expenses and PUT /api/expenses/:id
 */
const validateExpenseInput = (req, res, next) => {
  const { title, amount, category, date } = req.body;
  const errors = [];

  // Title validation
  if (title === undefined || title === null || String(title).trim() === '') {
    errors.push({ field: 'title', message: 'Expense title is required' });
  } else if (String(title).trim().length < 2) {
    errors.push({ field: 'title', message: 'Title must be at least 2 characters long' });
  } else if (String(title).trim().length > 100) {
    errors.push({ field: 'title', message: 'Title cannot exceed 100 characters' });
  }

  // Amount validation
  if (amount === undefined || amount === null || amount === '') {
    errors.push({ field: 'amount', message: 'Amount is required' });
  } else {
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      errors.push({ field: 'amount', message: 'Amount must be a valid number' });
    } else if (parsedAmount <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be greater than zero' });
    }
  }

  // Category validation
  if (!category || String(category).trim() === '') {
    errors.push({ field: 'category', message: 'Category is required' });
  } else if (!CATEGORIES.includes(String(category).trim())) {
    errors.push({
      field: 'category',
      message: `Invalid category. Must be one of: ${CATEGORIES.join(', ')}`,
    });
  }

  // Date validation
  if (!date) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'date', message: 'Invalid date format' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Sanitize and attach normalized values
  req.body.title = String(title).trim();
  req.body.amount = Math.round(Number(amount) * 100) / 100;
  req.body.category = String(category).trim();
  req.body.date = new Date(date);

  next();
};

module.exports = { validateExpenseInput };
