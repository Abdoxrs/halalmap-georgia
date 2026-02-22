// ============================================
// HalalMap Georgia - Authentication Middleware
// Protect admin routes with JWT verification
// ============================================

import { Request, Response, NextFunction } from 'express';
import { verifyToken, DecodedToken } from '../config/auth';

// ============================================
// EXTEND EXPRESS REQUEST TYPE
// Add user property to Request interface
// ============================================
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken; // Decoded JWT payload
    }
  }
}

// ============================================
// AUTHENTICATION MIDDLEWARE
// Verifies JWT token from Authorization header
// ============================================

/**
 * Middleware to verify JWT token and authenticate requests
 * Usage: Add to routes that require authentication
 * Example: router.get('/admin/dashboard', authenticateToken, handler)
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No authorization token provided',
      });
      return;
    }

    // Check if header starts with "Bearer "
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid authorization format. Use: Bearer <token>',
      });
      return;
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token is missing',
      });
      return;
    }

    // Verify and decode token
    try {
      const decoded = verifyToken(token);

      // Attach user info to request object
      // This makes user data available in route handlers
      req.user = decoded;

      // Log authentication in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Authenticated user: ${decoded.username} (ID: ${decoded.userId})`);
      }

      // Continue to next middleware/route handler
      next();
    } catch (tokenError: any) {
      // Token verification failed
      const message = tokenError.message || 'Invalid token';
      
      res.status(403).json({
        error: 'Forbidden',
        message: message,
      });
      return;
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

// ============================================
// OPTIONAL AUTHENTICATION
// Extracts user if token exists, but doesn't require it
// ============================================

/**
 * Middleware for optional authentication
 * Adds user to request if valid token exists, but doesn't reject if missing
 * Useful for endpoints that work for both authenticated and public users
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // If no auth header, just continue without user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    if (token) {
      try {
        // Try to verify token
        const decoded = verifyToken(token);
        req.user = decoded;
      } catch (error) {
        // Invalid token, but don't reject request
        // Just continue without user info
      }
    }

    next();
  } catch (error) {
    // On error, continue without authentication
    next();
  }
};

// ============================================
// ROLE-BASED ACCESS CONTROL (Future Enhancement)
// Check if user has specific role or permission
// ============================================

/**
 * Middleware factory for role-based access
 * @param allowedRoles - Array of roles that can access the route
 * Example: checkRole(['admin', 'moderator'])
 */
export const checkRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // User must be authenticated first
      if (!req.user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
        return;
      }

      // Check if user has required role
      // Note: This requires adding 'role' to JWT payload
      const userRole = (req.user as any).role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions',
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Permission check failed',
      });
    }
  };
};

// ============================================
// EXPORT MIDDLEWARE
// ============================================
export default {
  authenticateToken,
  optionalAuth,
  checkRole,
};
