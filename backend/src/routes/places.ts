// ============================================
// HalalMap Georgia - Places Routes (Public)
// Public API endpoints for places
// ============================================

import { Router } from 'express';
import {
  getAllPlaces,
  getPlaceById,
  getNearbyPlaces,
  getCities,
  getStatistics,
} from '../controllers/placesController';
import { validateNearbyQuery, handleValidationErrors } from '../middleware/validation';

// Create router instance
const router = Router();

// ============================================
// PUBLIC ROUTES
// These endpoints are accessible without authentication
// ============================================

/**
 * @route   GET /api/places
 * @desc    Get all places with optional filters
 * @access  Public
 * @query   type (optional) - Filter by 'restaurant' or 'mosque'
 * @query   verified (optional) - Filter by verification status
 * @query   city (optional) - Filter by city name
 * 
 * @example GET /api/places
 * @example GET /api/places?type=restaurant
 * @example GET /api/places?type=mosque&city=Tbilisi
 * @example GET /api/places?verified=true
 */
router.get('/', getAllPlaces);

/**
 * @route   GET /api/places/nearby
 * @desc    Find places near a location (geo-based search)
 * @access  Public
 * @query   lat (required) - Latitude
 * @query   lng (required) - Longitude
 * @query   distance (optional) - Search radius in meters (default: 5000)
 * @query   type (optional) - Filter by 'restaurant' or 'mosque'
 * 
 * @example GET /api/places/nearby?lat=41.7151&lng=44.8271
 * @example GET /api/places/nearby?lat=41.7151&lng=44.8271&distance=10000
 * @example GET /api/places/nearby?lat=41.7151&lng=44.8271&type=restaurant
 */
router.get(
  '/nearby',
  validateNearbyQuery,      // Validate query parameters
  handleValidationErrors,    // Handle validation errors
  getNearbyPlaces           // Controller function
);

/**
 * @route   GET /api/places/cities
 * @desc    Get list of cities with place counts
 * @access  Public
 * 
 * @example GET /api/places/cities
 */
router.get('/cities', getCities);

/**
 * @route   GET /api/places/statistics
 * @desc    Get overall statistics about places
 * @access  Public
 * 
 * @example GET /api/places/statistics
 */
router.get('/statistics', getStatistics);

/**
 * @route   GET /api/places/:id
 * @desc    Get a single place by ID
 * @access  Public
 * @param   id - Place ID
 * 
 * @example GET /api/places/1
 */
router.get('/:id', getPlaceById);

// ============================================
// EXPORT ROUTER
// ============================================
export default router;
