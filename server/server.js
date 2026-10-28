const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables (check both server/.env and root .env)
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { connectDB, isDbConnected } = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
const {
  checkDbConnection,
  notFoundHandler,
  errorHandler,
} = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for client applications
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Built-in JSON body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check & Diagnostics Endpoint
app.get('/api/health', (req, res) => {
  const connected = isDbConnected();
  res.status(connected ? 200 : 503).json({
    success: connected,
    status: connected ? 'HEALTHY' : 'DEGRADED',
    message: connected
      ? 'Expense Tracker API is fully operational'
      : 'API is running, but database connection is unavailable',
    timestamp: new Date().toISOString(),
    database: {
      connected,
      state: connected ? 'connected' : 'disconnected',
    },
    uptime: process.uptime(),
  });
});

// Root Info Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Expense Tracker REST API',
    version: '1.0.0',
    documentation: '/api/expenses',
    health: '/api/health',
  });
});

// Protect expenses API with database connection check
app.use('/api/expenses', checkDbConnection, expenseRoutes);

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

// Start Server when run directly
if (require.main === module) {
  const startServer = async () => {
    // Attempt DB connection
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n Expense Tracker Server is running on http://localhost:${PORT}`);
      console.log(` REST Endpoints available at http://localhost:${PORT}/api/expenses`);
      console.log(` Health check available at http://localhost:${PORT}/api/health\n`);
    });
  };

  startServer();
}

module.exports = app;
