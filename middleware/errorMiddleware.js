/**
 * ── CENTRALIZED ERROR HANDLER ──
 * This middleware catches all errors passed to next()
 * and returns a uniform JSON response.
 */

const errorHandler = (err, req, res, next) => {
  // Determine status code: 500 if unknown, or use provided status
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`[Error] ${err.message}`);
  
  res.status(statusCode).json({
    message: err.message,
    // stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Optional: Hide stack in production
    success: false
  });
};

/**
 * ── NOT FOUND HANDLER ──
 * Catches requests to routes that don't exist
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
