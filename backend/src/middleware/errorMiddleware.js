/**
 * Middleware: 404 Route Not Found & Root Welcome Handler
 */
export const notFoundHandler = (req, res, next) => {
  const host = req.get('host') || 'localhost:5000';
  const protocol = req.protocol || 'http';
  const baseUrl = `${protocol}://${host}`;

  // If root / is accessed directly
  if (req.originalUrl === '/' || req.originalUrl === '') {
    return res.status(200).json({
      success: true,
      service: 'ECO MART REST API',
      version: '2.5.0',
      message: 'Welcome to ECO MART Eco Marketplace & Green Logistics Platform API',
      status: 'OPERATIONAL',
      swaggerDocs: `${baseUrl}/api-docs`,
      healthCheck: `${baseUrl}/api/health`,
      apiEndpoints: `${baseUrl}/api`
    });
  }

  res.status(404).json({
    success: false,
    error: `API Route Not Found: [${req.method}] ${req.originalUrl}`,
    swaggerDocs: `${baseUrl}/api-docs`,
    healthCheck: `${baseUrl}/api/health`
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
