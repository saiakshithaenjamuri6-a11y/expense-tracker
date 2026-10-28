const { isDbConnected } = require('../config/db');

/**
 * Middleware to check database connection status before handling requests.
 */
const checkDbConnection = (req, res, next) => {
  // Allow health check and root endpoint through
  if (req.path === '/health' || req.path === '/') {
    return next();
  }

  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      message:
        'Database is not connected. Please check your MONGODB_URI in .env and ensure MongoDB is running.',
      error: 'DB_DISCONNECTED',
    });
  }
  next();
};

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err.message || err);

  // Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: '${err.value}' is not a valid identifier`,
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  // JSON parse error in body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body',
    });
  }

  // Default internal server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = { checkDbConnection, notFoundHandler, errorHandler };
