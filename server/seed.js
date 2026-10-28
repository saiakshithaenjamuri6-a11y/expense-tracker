const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Expense } = require('./models/Expense');
const { connectDB } = require('./config/db');

// Sample development expenses (clearly labeled for testing)
const SAMPLE_EXPENSES = [
  {
    title: 'Grocery shopping at DMart',
    amount: 3450.5,
    category: 'Food',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    title: 'Electricity & Water Utility Bill',
    amount: 2150.0,
    category: 'Bills',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    title: 'Metro Smart Card Recharge',
    amount: 800.0,
    category: 'Travel',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    title: 'Full Stack Web Dev Course - Udemy',
    amount: 549.0,
    category: 'Education',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    title: 'Doctor Consultation & Medicine',
    amount: 1250.0,
    category: 'Healthcare',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    title: 'Movie Tickets & Popcorn',
    amount: 950.0,
    category: 'Entertainment',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
  },
  {
    title: 'Running Shoes & Sports Gear',
    amount: 2899.0,
    category: 'Shopping',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    title: 'Office Stationery & Notebooks',
    amount: 320.0,
    category: 'Other',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
  },
];

const runSeed = async () => {
  const isClearOnly = process.argv.includes('--clear');

  console.log('Connecting to MongoDB for seeding...');
  const conn = await connectDB();

  if (!conn) {
    console.error('Cannot run seed script: MongoDB is not connected.');
    process.exit(1);
  }

  try {
    const deletedCount = await Expense.deleteMany({});
    console.log(`Cleared existing expenses (${deletedCount.deletedCount} records deleted).`);

    if (isClearOnly) {
      console.log('Database cleared successfully. Exiting.');
      await mongoose.disconnect();
      process.exit(0);
    }

    const inserted = await Expense.insertMany(SAMPLE_EXPENSES);
    console.log(` Successfully seeded ${inserted.length} sample expenses:`);
    inserted.forEach((item, index) => {
      console.log(
        `   [${index + 1}] ₹${item.amount.toLocaleString('en-IN')} - ${item.title} (${item.category})`
      );
    });

    console.log('\nSeed completed successfully! You can now start the frontend and backend.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

runSeed();
