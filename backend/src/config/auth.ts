// ============================================
// HalalMap Georgia - Authentication Configuration
// JWT token generation and verification
// ============================================

import jwt, { SignOptions, VerifyOptions, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// CONFIGURATION CONSTANTS
// ============================================

// JWT secret key from environment (must be set!)
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-key-change-this';

if (JWT_SECRET === 'your-super-secret-key-change-this') {
  console.warn('⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET in .env for production!');
}

// Token expiration time (default: 7 days)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Bcrypt salt rounds for password hashing
const SALT_ROUNDS = 10;

// ============================================
// INTERFACES FOR TYPE SAFETY
// ============================================

// JWT payload structure
export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
}

// Decoded token with expiration
export interface DecodedToken extends JWTPayload {
  iat: number; // Issued at (timestamp)
  exp: number; // Expiration (timestamp)
}

// ============================================
// PASSWORD HASHING
// Use bcrypt for secure password storage
// ============================================

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Compare plain text password with hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Failed to compare passwords');
  }
};

// ============================================
// JWT TOKEN GENERATION
// ============================================

/**
 * Generate JWT token for authenticated user
 * @param payload - User information to encode in token
 * @returns Signed JWT token string
 */
export const generateToken = (payload: JWTPayload): string => {
  try {
    // Sign token with secret and expiration
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'halalmap-georgia',
      audience: 'halalmap-admin',
    } as SignOptions);
    
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

// ============================================
// JWT TOKEN VERIFICATION
// ============================================

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): DecodedToken => {
  try {
    // Verify token signature and decode
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'halalmap-georgia',
      audience: 'halalmap-admin',
    } as VerifyOptions) as DecodedToken;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      console.error('Error verifying token:', error);
      throw new Error('Token verification failed');
    }
  }
};

// ============================================
// TOKEN EXPIRATION CHECK
// ============================================

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns True if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as DecodedToken;
    if (!decoded || !decoded.exp) {
      return true;
    }

    // Compare expiration time with current time
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// ============================================
// REFRESH TOKEN (Optional - for future implementation)
// ============================================

/**
 * Generate a refresh token with longer expiration
 * @param payload - User information
 * @returns Refresh token
 */
export const generateRefreshToken = (payload: JWTPayload): string => {
  try {
    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '30d', // Refresh tokens last longer
      issuer: 'halalmap-georgia',
      audience: 'halalmap-refresh',
    });

    return refreshToken;
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
};

// ============================================
// EXPORT CONFIGURATION
// ============================================
export const authConfig = {
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: JWT_EXPIRES_IN,
  saltRounds: SALT_ROUNDS,
};

export default {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  isTokenExpired,
  generateRefreshToken,
  authConfig,
};
