import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eco-mart-secret-key-2026';
const VALID_ADMIN_KEYS = ['ECO-ADMIN-2026', 'ECO-SUPER-ADMIN-2026', 'ADMIN@2026', 'ECOADMIN'];

/**
 * Middleware: Verify JWT Bearer Token
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
  }
};

/**
 * Middleware: Authorize Specific Roles
 * @param {...string} allowedRoles 
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, error: 'Forbidden: User identity not found' });
    }

    const userRole = req.user.role.toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Access restricted to [${allowedRoles.join(', ')}]. Logged in as ${userRole}.`
      });
    }

    next();
  };
};

/**
 * Middleware: Validate Admin Security Key for Admin Registration
 */
export const requireAdminSecurityKey = (req, res, next) => {
  const { securityKey } = req.body;
  const cleanedKey = securityKey ? securityKey.toString().trim().toUpperCase() : '';

  if (!cleanedKey || !VALID_ADMIN_KEYS.includes(cleanedKey)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid Admin Security Key! Registration restricted to authorized platform administrators.'
    });
  }

  next();
};
