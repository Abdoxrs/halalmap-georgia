// ============================================
// HalalMap Georgia - Main Server Entry Point
// Express.js server with PostgreSQL and JWT auth
// ============================================

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import route handlers
import placesRouter from './routes/places';
import adminRouter from './routes/admin';

// Import database connection
import { pool, testConnection } from './config/database';

// ============================================
// LOAD ENVIRONMENT VARIABLES
// Must be called before accessing process.env
// ============================================
dotenv.config();

// ============================================
// INITIALIZE EXPRESS APP
// ============================================
const app: Express = express();

// Port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// 1. HELMET - Security headers
// Protects against common web vulnerabilities
app.use(helmet({
  contentSecurityPolicy: false, // Disable if using CDN resources
  crossOriginEmbedderPolicy: false
}));

// 2. COMPRESSION - Gzip compression for responses
// Reduces response size and improves performance
app.use(compression());

// 3. CORS - Cross-Origin Resource Sharing
// Allows frontend to communicate with backend
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 4. JSON & URL-encoded body parsers
// Parse incoming JSON and form data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. MORGAN - HTTP request logger
// Logs all incoming requests in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Use combined format in production
  app.use(morgan('combined'));
}

// 6. RATE LIMITING - Prevent abuse
// Limit each IP to X requests per time window
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15') * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ============================================
// HEALTH CHECK ENDPOINT
// Used by monitoring tools and load balancers
// ============================================
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection failed'
    });
  }
});

// ============================================
// API ROUTES
// All routes are prefixed with /api
// ============================================

// Root endpoint - API information
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'HalalMap Georgia API',
    version: '1.0.0',
    description: 'API for finding halal restaurants and mosques in Georgia',
    endpoints: {
      health: '/health',
      places: '/api/places',
      nearby: '/api/places/nearby',
      admin_login: '/api/admin/login',
      admin_places: '/api/admin/places'
    },
    documentation: 'https://github.com/yourusername/halalmap-georgia'
  });
});

// Mount route handlers
app.use('/api/places', placesRouter);  // Public endpoints for places
app.use('/api/admin', adminRouter);     // Protected admin endpoints

// ============================================
// 404 HANDLER - Route not found
// ============================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// Catches all unhandled errors and returns JSON
// ============================================
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error for debugging
  console.error('Error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'Something went wrong',
    ...(isDevelopment && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================
const startServer = async () => {
  try {
    // Test database connection first
    console.log('🔍 Testing database connection...');
    await testConnection();
    console.log('✅ Database connected successfully');

    // Start listening for requests
    app.listen(PORT, () => {
      console.log('🚀 Server started successfully');
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Server running on http://localhost:${PORT}`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api`);
      console.log('\n✨ HalalMap Georgia API is ready!\n');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Exit with error code
  }
};

// ============================================
// GRACEFUL SHUTDOWN
// Handle server shutdown cleanly
// ============================================
process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  
  // Close database connections
  await pool.end();
  console.log('📊 Database connections closed');
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
  
  // Close database connections
  await pool.end();
  console.log('📊 Database connections closed');
  
  process.exit(0);
});

// ============================================
// HANDLE UNHANDLED REJECTIONS
// ============================================
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to log this to a monitoring service
});

// Start the server
startServer();

// Export app for testing
export default app;
