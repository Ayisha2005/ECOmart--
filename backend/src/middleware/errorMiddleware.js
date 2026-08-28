/**
 * Middleware: 404 Route Not Found Handler
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `API Route Not Found: [${req.method}] ${req.originalUrl}`,
    swaggerDocs: 'http://localhost:5000/api-docs'
  });
};

/**
 * Middleware: Global Centralized Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);
  
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
