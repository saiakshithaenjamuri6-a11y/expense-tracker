const mongoose = require('mongoose');
const { Expense, CATEGORIES } = require('../models/Expense');

/**
 * @desc    Get all expenses (with optional category and search filters)
 * @route   GET /api/expenses
 * @access  Public
 */
const getAllExpenses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All' && category !== '') {
      filter.category = category;
    }

    if (search && search.trim() !== '') {
      // Escape special regex characters to prevent regex injection
      const sanitizedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.title = { $regex: sanitizedSearch, $options: 'i' };
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single expense by ID
 * @route   GET /api/expenses/:id
 * @access  Public
 */
const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid expense ID format: '${id}'`,
      });
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new expense
 * @route   POST /api/expenses
 * @access  Public
 */
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;

    const newExpense = await Expense.create({
      title,
      amount,
      category,
      date,
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: newExpense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing expense
 * @route   PUT /api/expenses/:id
 * @access  Public
 */
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid expense ID format: '${id}'`,
      });
    }

    const { title, amount, category, date } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, amount, category, date },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 * @access  Public
 */
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid expense ID format: '${id}'`,
      });
    }

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id: deletedExpense._id, title: deletedExpense.title },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get expense summary (total amount, transaction count, category-wise breakdown)
 * @route   GET /api/expenses/summary
 * @access  Public
 */
const getExpenseSummary = async (req, res, next) => {
  try {
    // Aggregation pipeline to group expenses by category
    const categoryAggregation = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    // Calculate total amount and transaction count across all records
    const totalsAggregation = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    const overallTotal =
      totalsAggregation.length > 0
        ? Math.round(totalsAggregation[0].totalAmount * 100) / 100
        : 0;

    const transactionCount =
      totalsAggregation.length > 0 ? totalsAggregation[0].transactionCount : 0;

    // Build category summary with percentage from database records
    const categorySummary = categoryAggregation.map((cat) => {
      const catTotal = Math.round(cat.total * 100) / 100;
      const percentage =
        overallTotal > 0 ? Math.round((catTotal / overallTotal) * 1000) / 10 : 0;

      return {
        category: cat._id,
        total: catTotal,
        count: cat.count,
        percentage,
      };
    });

    // Highest-spending category
    const highestCategory =
      categorySummary.length > 0
        ? {
            category: categorySummary[0].category,
            total: categorySummary[0].total,
            count: categorySummary[0].count,
            percentage: categorySummary[0].percentage,
          }
        : null;

    res.status(200).json({
      success: true,
      data: {
        totalAmount: overallTotal,
        transactionCount,
        highestCategory,
        categorySummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get list of predefined expense categories
 * @route   GET /api/expenses/categories
 * @access  Public
 */
const getCategories = (req, res) => {
  res.status(200).json({
    success: true,
    data: CATEGORIES,
  });
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getCategories,
};
