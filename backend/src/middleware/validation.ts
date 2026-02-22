// ============================================
// HalalMap Georgia - Validation Middleware
// Validate request data using express-validator
// ============================================

import { Request, Response, NextFunction } from 'express';
import { validationResult, body, query, ValidationChain } from 'express-validator';

// ============================================
// VALIDATION ERROR HANDLER
// Checks validation results and returns errors
// ============================================

/**
 * Middleware to handle validation errors
 * Must be used after validation chains
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get validation errors from request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Return validation errors with 400 Bad Request
    res.status(400).json({
      error: 'Validation Error',
      errors: errors.array().map((err: any) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      })),
    });
    return;
  }

  // No validation errors, continue to next middleware
  next();
};

// ============================================
// VALIDATION RULES FOR PLACES
// ============================================

/**
 * Validation rules for creating a new place
 */
export const validateCreatePlace: ValidationChain[] = [
  // Name: Required, 3-255 characters
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),

  // Type: Must be 'restaurant' or 'mosque'
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['restaurant', 'mosque'])
    .withMessage('Type must be either "restaurant" or "mosque"'),

  // Latitude: Required, valid range -90 to 90
  body('latitude')
    .notEmpty()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90')
    .toFloat(),

  // Longitude: Required, valid range -180 to 180
  body('longitude')
    .notEmpty()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
    .toFloat(),

  // City: Optional, 2-100 characters
  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),

  // Address: Optional
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),

  // Description: Optional
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  // Phone: Optional, basic format check
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\+\-\(\)]+$/)
    .withMessage('Phone number contains invalid characters'),

  // Website: Optional, must be valid URL
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Website must be a valid URL'),

  // Verified: Optional, boolean
  body('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified must be a boolean')
    .toBoolean(),
];

/**
 * Validation rules for updating a place
 * All fields are optional since it's a partial update
 */
export const validateUpdatePlace: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),

  body('type')
    .optional()
    .isIn(['restaurant', 'mosque'])
    .withMessage('Type must be either "restaurant" or "mosque"'),

  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90')
    .toFloat(),

  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
    .toFloat(),

  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\+\-\(\)]+$/)
    .withMessage('Phone number contains invalid characters'),

  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Website must be a valid URL'),

  body('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified must be a boolean')
    .toBoolean(),
];

// ============================================
// VALIDATION RULES FOR NEARBY SEARCH
// ============================================

/**
 * Validation rules for nearby places query
 */
export const validateNearbyQuery: ValidationChain[] = [
  // Latitude: Required query parameter
  query('lat')
    .notEmpty()
    .withMessage('Latitude (lat) is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90')
    .toFloat(),

  // Longitude: Required query parameter
  query('lng')
    .notEmpty()
    .withMessage('Longitude (lng) is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
    .toFloat(),

  // Distance: Optional, default 5000m, max 50000m (50km)
  query('distance')
    .optional()
    .isInt({ min: 100, max: 50000 })
    .withMessage('Distance must be between 100 and 50000 meters')
    .toInt(),

  // Type filter: Optional, restaurant or mosque
  query('type')
    .optional()
    .isIn(['restaurant', 'mosque'])
    .withMessage('Type must be either "restaurant" or "mosque"'),
];

// ============================================
// VALIDATION RULES FOR ADMIN LOGIN
// ============================================

/**
 * Validation rules for admin login
 */
export const validateLogin: ValidationChain[] = [
  // Username: Required
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be between 3 and 100 characters'),

  // Password: Required, minimum 6 characters
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// ============================================
// VALIDATION RULES FOR ADMIN REGISTRATION
// ============================================

/**
 * Validation rules for creating admin user
 */
export const validateAdminRegistration: ValidationChain[] = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscore, and hyphen'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

// ============================================
// VALIDATION RULES FOR ID PARAMETERS
// ============================================

/**
 * Validate numeric ID parameter
 */
export const validateIdParam = (paramName: string = 'id'): ValidationChain[] => [
  query(paramName)
    .isInt({ min: 1 })
    .withMessage(`${paramName} must be a positive integer`)
    .toInt(),
];

// ============================================
// EXPORT ALL VALIDATORS
// ============================================
export default {
  handleValidationErrors,
  validateCreatePlace,
  validateUpdatePlace,
  validateNearbyQuery,
  validateLogin,
  validateAdminRegistration,
  validateIdParam,
};
