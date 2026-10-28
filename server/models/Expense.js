const mongoose = require('mongoose');

const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Education',
  'Healthcare',
  'Entertainment',
  'Other',
];

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      set: (v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v),
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: 'Category must be one of: {VALUE}',
      },
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient sorting by date
expenseSchema.index({ date: -1, createdAt: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = { Expense, CATEGORIES };
