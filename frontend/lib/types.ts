// ============================================
// HalalMap Georgia - TypeScript Type Definitions
// Shared types across the frontend application
// ============================================

// ============================================
// PLACE TYPES
// ============================================

/**
 * Place type - can be restaurant or mosque
 */
export type PlaceType = 'restaurant' | 'mosque';

/**
 * Place interface - matches database schema
 */
export interface Place {
  id: number;
  name: string;
  type: PlaceType;
  latitude: number;
  longitude: number;
  city: string | null;
  address: string | null;
  description: string | null;
  phone: string | null;
  website: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
  
  // Additional fields from nearby search
  distance_meters?: number;
  distance_text?: string;
}

/**
 * Place form data for create/update
 */
export interface PlaceFormData {
  name: string;
  type: PlaceType;
  latitude: number;
  longitude: number;
  city?: string;
  address?: string;
  description?: string;
  phone?: string;
  website?: string;
  verified?: boolean;
}

// ============================================
// MAP TYPES
// ============================================

/**
 * Geographic coordinates
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Map bounds
 */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * Map marker data
 */
export interface MapMarker {
  id: number;
  position: Coordinates;
  title: string;
  type: PlaceType;
  verified: boolean;
}

// ============================================
// FILTER TYPES
// ============================================

/**
 * Filter options for places
 */
export interface PlaceFilters {
  type: PlaceType | 'all';
  distance: number; // in meters
  verified?: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

/**
 * Places list response
 */
export interface PlacesResponse {
  success: boolean;
  count: number;
  data: Place[];
}

/**
 * Nearby places response
 */
export interface NearbyPlacesResponse {
  success: boolean;
  count: number;
  search: {
    latitude: number;
    longitude: number;
    radius_meters: number;
    type: string;
  };
  data: Place[];
}

/**
 * Statistics response
 */
export interface StatisticsResponse {
  success: boolean;
  data: {
    total_places: number;
    total_restaurants: number;
    total_mosques: number;
    verified_places: number;
    unverified_places: number;
    total_cities: number;
    recent_additions: number;
  };
}

/**
 * Cities response
 */
export interface CitiesResponse {
  success: boolean;
  count: number;
  data: CityData[];
}

export interface CityData {
  city: string;
  count: number;
  restaurants: number;
  mosques: number;
}

// ============================================
// ADMIN TYPES
// ============================================

/**
 * Admin user
 */
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
  last_login: string | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AdminUser;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  overview: {
    total_places: number;
    restaurants: number;
    mosques: number;
    verified: number;
    unverified: number;
    cities: number;
  };
  recent_additions: Place[];
  top_cities: CityData[];
}

// ============================================
// UI STATE TYPES
// ============================================

/**
 * Loading state
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Toast notification
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean;
  data?: any;
}

// ============================================
// FORM VALIDATION TYPES
// ============================================

/**
 * Form errors
 */
export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * Form field
 */
export interface FormField {
  name: string;
  value: any;
  error?: string;
  touched: boolean;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Pagination data
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================
// EXPORT ALL TYPES
// ============================================
export default {
  // Re-export for convenience
};
