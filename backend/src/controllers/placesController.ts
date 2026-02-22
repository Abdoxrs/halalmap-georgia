// ============================================
// HalalMap Georgia - Places Controller
// Business logic for places CRUD operations
// ============================================

import { Request, Response } from 'express';
import { pool } from '../config/database';

// ============================================
// GET ALL PLACES
// Returns all places in the database
// ============================================
export const getAllPlaces = async (req: Request, res: Response): Promise<void> => {
  try {
    // Optional query parameters for filtering
    const { type, verified, city } = req.query;

    // Build dynamic query based on filters
    let query = 'SELECT * FROM places WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    // Filter by type (restaurant or mosque)
    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Filter by verification status
    if (verified !== undefined) {
      query += ` AND verified = $${paramIndex}`;
      params.push(verified === 'true');
      paramIndex++;
    }

    // Filter by city
    if (city) {
      query += ` AND city ILIKE $${paramIndex}`; // ILIKE for case-insensitive
      params.push(`%${city}%`);
      paramIndex++;
    }

    // Order by city and name
    query += ' ORDER BY city, name';

    // Execute query
    const result = await pool.query(query, params);

    // Return results
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch places',
    });
  }
};

// ============================================
// GET PLACE BY ID
// Returns a single place by ID
// ============================================
export const getPlaceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Query place by ID
    const result = await pool.query('SELECT * FROM places WHERE id = $1', [id]);

    // Check if place exists
    if (result.rows.length === 0) {
      res.status(404).json({
        error: 'Not Found',
        message: `Place with ID ${id} not found`,
      });
      return;
    }

    // Return place data
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching place:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch place',
    });
  }
};

// ============================================
// GET NEARBY PLACES
// Returns places within specified radius using PostGIS
// ============================================
export const getNearbyPlaces = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract query parameters (already validated by middleware)
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const distance = parseInt(req.query.distance as string) || 5000; // Default 5km
    const type = req.query.type as string | undefined;

    console.log(`🔍 Searching for places near (${lat}, ${lng}) within ${distance}m`);

    // Use the database function for efficient geo query
    const query = `
      SELECT * FROM get_nearby_places($1, $2, $3, $4)
    `;

    const params = [lat, lng, distance, type || null];
    const result = await pool.query(query, params);

    // Format distance for readability (convert to km if > 1000m)
    const formattedResults = result.rows.map((place) => ({
      ...place,
      distance: place.distance_meters,
      distance_text:
        place.distance_meters >= 1000
          ? `${(place.distance_meters / 1000).toFixed(1)} km`
          : `${Math.round(place.distance_meters)} m`,
    }));

    console.log(`✅ Found ${formattedResults.length} places`);

    // Return results
    res.json({
      success: true,
      count: formattedResults.length,
      search: {
        latitude: lat,
        longitude: lng,
        radius_meters: distance,
        type: type || 'all',
      },
      data: formattedResults,
    });
  } catch (error) {
    console.error('Error finding nearby places:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to find nearby places',
    });
  }
};

// ============================================
// GET CITIES
// Returns list of unique cities with place counts
// ============================================
export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get cities with count of places in each
    const query = `
      SELECT 
        city,
        COUNT(*) as count,
        COUNT(CASE WHEN type = 'restaurant' THEN 1 END) as restaurants,
        COUNT(CASE WHEN type = 'mosque' THEN 1 END) as mosques
      FROM places
      WHERE city IS NOT NULL
      GROUP BY city
      ORDER BY count DESC, city
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch cities',
    });
  }
};

// ============================================
// GET STATISTICS
// Returns overall statistics about places
// ============================================
export const getStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get various statistics in a single query
    const query = `
      SELECT 
        COUNT(*) as total_places,
        COUNT(CASE WHEN type = 'restaurant' THEN 1 END) as total_restaurants,
        COUNT(CASE WHEN type = 'mosque' THEN 1 END) as total_mosques,
        COUNT(CASE WHEN verified = true THEN 1 END) as verified_places,
        COUNT(CASE WHEN verified = false THEN 1 END) as unverified_places,
        COUNT(DISTINCT city) as total_cities
      FROM places
    `;

    const result = await pool.query(query);
    const stats = result.rows[0];

    // Get recent additions (last 7 days)
    const recentQuery = `
      SELECT COUNT(*) as recent_additions
      FROM places
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `;
    const recentResult = await pool.query(recentQuery);
    stats.recent_additions = parseInt(recentResult.rows[0].recent_additions);

    res.json({
      success: true,
      data: {
        total_places: parseInt(stats.total_places),
        total_restaurants: parseInt(stats.total_restaurants),
        total_mosques: parseInt(stats.total_mosques),
        verified_places: parseInt(stats.verified_places),
        unverified_places: parseInt(stats.unverified_places),
        total_cities: parseInt(stats.total_cities),
        recent_additions: stats.recent_additions,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch statistics',
    });
  }
};

// ============================================
// EXPORT CONTROLLER FUNCTIONS
// ============================================
export default {
  getAllPlaces,
  getPlaceById,
  getNearbyPlaces,
  getCities,
  getStatistics,
};
