// ============================================
// HalalMap Georgia - Database Configuration
// PostgreSQL connection using node-postgres (pg)
// Configured for Supabase hosted database
// ============================================

import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ============================================
// CONNECTION POOL CONFIGURATION
// Using connection pooling for better performance
// ============================================

// Option 1: Use full connection string (recommended for Supabase)
const poolConfig: PoolConfig = process.env.DATABASE_URL
  ? {
      // Full connection string from Supabase
      connectionString: process.env.DATABASE_URL,
      
      // SSL configuration (required for Supabase)
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
      
      // Connection pool settings
      min: parseInt(process.env.DB_POOL_MIN || '2'), // Minimum connections
      max: parseInt(process.env.DB_POOL_MAX || '10'), // Maximum connections
      
      // Connection timeout in milliseconds
      connectionTimeoutMillis: 5000,
      
      // Idle timeout - close idle connections after 30 seconds
      idleTimeoutMillis: 30000,
      
      // Query timeout - cancel queries that take longer than 30 seconds
      query_timeout: 30000,
      
      // Keep-alive to prevent connection drops
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    }
  : // Option 2: Use individual connection parameters
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      
      // SSL for production
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
      
      // Pool settings
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      query_timeout: 30000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    };

// Create the connection pool
export const pool = new Pool(poolConfig);

// ============================================
// CONNECTION EVENT HANDLERS
// Monitor connection health and errors
// ============================================

// Event: New client connects
pool.on('connect', (client) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔌 New database client connected');
  }
});

// Event: Client encounters an error
pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle database client:', err);
  // In production, send this to error monitoring service (Sentry, etc.)
});

// Event: Client is removed from pool
pool.on('remove', (client) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔓 Database client removed from pool');
  }
});

// ============================================
// TEST DATABASE CONNECTION
// Used during server startup to verify connection
// ============================================
export const testConnection = async (): Promise<boolean> => {
  try {
    // Try to execute a simple query
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    
    console.log('📊 Database Information:');
    console.log('   Current Time:', result.rows[0].current_time);
    console.log('   Version:', result.rows[0].version.split('\n')[0]);
    
    // Check if PostGIS extension is available
    const postGISCheck = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'postgis') as has_postgis"
    );
    
    if (postGISCheck.rows[0].has_postgis) {
      console.log('   PostGIS: ✅ Enabled');
    } else {
      console.warn('   PostGIS: ⚠️  Not enabled - geographic queries will not work!');
      console.warn('   Run: CREATE EXTENSION postgis;');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    throw error;
  }
};

// ============================================
// QUERY HELPER WITH LOGGING
// Wrapper around pool.query with optional logging
// ============================================
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`⚠️  Slow query (${duration}ms):`, text);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Query error:', error);
    console.error('   Query:', text);
    console.error('   Params:', params);
    throw error;
  }
};

// ============================================
// TRANSACTION HELPER
// Execute multiple queries in a transaction
// ============================================
export const transaction = async (callback: (client: any) => Promise<void>) => {
  // Get a client from the pool
  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // Execute callback with client
    await callback(client);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('✅ Transaction completed successfully');
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('❌ Transaction failed, rolled back:', error);
    throw error;
  } finally {
    // Always release client back to pool
    client.release();
  }
};

// ============================================
// GRACEFUL SHUTDOWN
// Close all connections when app terminates
// ============================================
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('📊 Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing database pool:', error);
    throw error;
  }
};

// ============================================
// EXPORT POOL AS DEFAULT
// ============================================
export default pool;
