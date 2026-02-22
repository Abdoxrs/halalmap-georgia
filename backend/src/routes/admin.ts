// ============================================
// HalalMap Georgia - Admin Routes (Protected)
// Admin-only API endpoints with authentication
// ============================================

import { Router } from 'express';
import {
  adminLogin,
  getCurrentUser,
  createPlace,
  updatePlace,
  deletePlace,
  toggleVerified,
  getDashboardStats,
} from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';
import {
  validateLogin,
  validateCreatePlace,
  validateUpdatePlace,
  handleValidationErrors,
} from '../middleware/validation';

// Create router instance
const router = Router();

// ============================================
// PUBLIC ADMIN ROUTES (No Authentication)
// ============================================

/**
 * @route   POST /api/admin/login
 * @desc    Admin login - returns JWT token
 * @access  Public
 * @body    username (required) - Admin username
 * @body    password (required) - Admin password
 * 
 * @example POST /api/admin/login
 * Body: { "username": "admin", "password": "Admin@123" }
 * 
 * @returns { token: "jwt_token", user: {...} }
 */
router.post(
  '/login',
  validateLogin,            // Validate login credentials
  handleValidationErrors,   // Handle validation errors
  adminLogin               // Controller function
);

// ============================================
// PROTECTED ADMIN ROUTES
// All routes below require authentication
// Add authenticateToken middleware to protect routes
// ============================================

/**
 * @route   GET /api/admin/me
 * @desc    Get current authenticated user info
 * @access  Private (Admin only)
 * @header  Authorization: Bearer <token>
 * 
 * @example GET /api/admin/me
 * Headers: { "Authorization": "Bearer jwt_token" }
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin only)
 * @header  Authorization: Bearer <token>
 * 
 * @example GET /api/admin/dashboard
 * Headers: { "Authorization": "Bearer jwt_token" }
 */
router.get('/dashboard', authenticateToken, getDashboardStats);

// ============================================
// PLACES MANAGEMENT (CRUD)
// ============================================

/**
 * @route   POST /api/admin/places
 * @desc    Create a new place
 * @access  Private (Admin only)
 * @header  Authorization: Bearer <token>
 * @body    name (required) - Place name
 * @body    type (required) - 'restaurant' or 'mosque'
 * @body    latitude (required) - Latitude coordinate
 * @body    longitude (required) - Longitude coordinate
 * @body    city (optional) - City name
 * @body    address (optional) - Full address
 * @body    description (optional) - Description
 * @body    phone (optional) - Phone number
 * @body    website (optional) - Website URL
 * @body    verified (optional) - Verification status (boolean)
 * 
 * @example POST /api/admin/places
 * Headers: { "Authorization": "Bearer jwt_token" }
 * Body: {
 *   "name": "New Restaurant",
 *   "type": "restaurant",
 *   "latitude": 41.7151,
 *   "longitude": 44.8271,
 *   "city": "Tbilisi"
 * }
 */
router.post(
  '/places',
  authenticateToken,        // Require authentication
  validateCreatePlace,      // Validate place data
  handleValidationErrors,   // Handle validation errors
  createPlace              // Controller function
);

/**
 * @route   PUT /api/admin/places/:id
 * @desc    Update an existing place
 * @access  Private (Admin only)
 * @header  Authorization: Bearer <token>
 * @param   id - Place ID
 * @body    Any place fields to update (all optional)
 * 
 * @example PUT /api/admin/places/1
 * Headers: { "Authorization": "Bearer jwt_token" }
 * Body: {
 *   "name": "Updated Name",
 *   "verified": true
 * }
 */
router.put(
  '/places/:id',
  authenticateToken,        // Require authentication
  validateUpdatePlace,      // Validate update data
  handleValidationErrors,   // Handle validation errors
  updatePlace              // Controller function
);

/**
 * @route   PATCH /api/admin/places/:id/verify
 * @desc    Toggle verified status of a place
 * @access  Private (Admin only)
 * @header  Authorization: Bearer <token>
 * @param   id - Place ID
 * 
 * @example PATCH /api/admin/places/1/verify
 * Headers: { "Authorization": "Bearer jwt_token" }
 */
router.patch(
  '/places/:id/verify',
  authenticateToken,        // Require authentication
  toggleVerified           // Controller function
);

/**
 * @route   DELETE /api/admin/places/:id
 * @desc    Delete a place
 * @access  Private (Admin only)
 * @header  Authorization: Bearer <token>
 * @param   id - Place ID
 * 
 * @example DELETE /api/admin/places/1
 * Headers: { "Authorization": "Bearer jwt_token" }
 */
router.delete(
  '/places/:id',
  authenticateToken,        // Require authentication
  deletePlace              // Controller function
);

// ============================================
// ROUTE TESTING
// Use these examples to test the API
// ============================================

/*
// Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin@123"}'

// Get current user (with token)
curl http://localhost:5000/api/admin/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

// Create place (with token)
curl -X POST http://localhost:5000/api/admin/places \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Restaurant",
    "type": "restaurant",
    "latitude": 41.7151,
    "longitude": 44.8271,
    "city": "Tbilisi"
  }'

// Toggle verified (with token)
curl -X PATCH http://localhost:5000/api/admin/places/1/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

// Delete place (with token)
curl -X DELETE http://localhost:5000/api/admin/places/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
*/

// ============================================
// EXPORT ROUTER
// ============================================
export default router;
