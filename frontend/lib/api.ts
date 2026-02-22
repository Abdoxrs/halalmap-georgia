// ============================================
// HalalMap Georgia - API Client
// Axios-based HTTP client for backend communication
// ============================================

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type {
  Place,
  PlaceFormData,
  PlacesResponse,
  NearbyPlacesResponse,
  StatisticsResponse,
  CitiesResponse,
  LoginCredentials,
  LoginResponse,
  DashboardStats,
  ApiResponse,
} from './types';

// ============================================
// AXIOS INSTANCE CONFIGURATION
// ============================================

// Get API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Create axios instance with default configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR
// Add authentication token to requests
// ============================================
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (if exists)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// Handle errors globally
// ============================================
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', error.response?.data || error.message);
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // Only redirect if on admin pages
        if (window.location.pathname.startsWith('/admin') && 
            !window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// PUBLIC API ENDPOINTS
// ============================================

/**
 * Get all places with optional filters
 */
export const getAllPlaces = async (params?: {
  type?: string;
  verified?: boolean;
  city?: string;
}): Promise<PlacesResponse> => {
  const response = await api.get<PlacesResponse>('/places', { params });
  return response.data;
};

/**
 * Get a single place by ID
 */
export const getPlaceById = async (id: number): Promise<ApiResponse<Place>> => {
  const response = await api.get<ApiResponse<Place>>(`/places/${id}`);
  return response.data;
};

/**
 * Find nearby places using geo search
 */
export const getNearbyPlaces = async (
  lat: number,
  lng: number,
  distance?: number,
  type?: string
): Promise<NearbyPlacesResponse> => {
  const response = await api.get<NearbyPlacesResponse>('/places/nearby', {
    params: { lat, lng, distance, type },
  });
  return response.data;
};

/**
 * Get list of cities with place counts
 */
export const getCities = async (): Promise<CitiesResponse> => {
  const response = await api.get<CitiesResponse>('/places/cities');
  return response.data;
};

/**
 * Get overall statistics
 */
export const getStatistics = async (): Promise<StatisticsResponse> => {
  const response = await api.get<StatisticsResponse>('/places/statistics');
  return response.data;
};

// ============================================
// ADMIN API ENDPOINTS
// ============================================

/**
 * Admin login - returns JWT token
 */
export const adminLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/admin/login', credentials);
  
  // Save token to localStorage
  if (response.data.token && typeof window !== 'undefined') {
    localStorage.setItem('auth_token', response.data.token);
  }
  
  return response.data;
};

/**
 * Admin logout - clear token
 */
export const adminLogout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

/**
 * Get current admin user info
 */
export const getCurrentUser = async (): Promise<ApiResponse<any>> => {
  const response = await api.get<ApiResponse<any>>('/admin/me');
  return response.data;
};

/**
 * Get admin dashboard statistics
 */
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard');
  return response.data;
};

/**
 * Create a new place (admin only)
 */
export const createPlace = async (placeData: PlaceFormData): Promise<ApiResponse<Place>> => {
  const response = await api.post<ApiResponse<Place>>('/admin/places', placeData);
  return response.data;
};

/**
 * Update an existing place (admin only)
 */
export const updatePlace = async (
  id: number,
  placeData: Partial<PlaceFormData>
): Promise<ApiResponse<Place>> => {
  const response = await api.put<ApiResponse<Place>>(`/admin/places/${id}`, placeData);
  return response.data;
};

/**
 * Toggle verified status (admin only)
 */
export const togglePlaceVerified = async (id: number): Promise<ApiResponse<Place>> => {
  const response = await api.patch<ApiResponse<Place>>(`/admin/places/${id}/verify`);
  return response.data;
};

/**
 * Delete a place (admin only)
 */
export const deletePlace = async (id: number): Promise<ApiResponse<any>> => {
  const response = await api.delete<ApiResponse<any>>(`/admin/places/${id}`);
  return response.data;
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('auth_token');
  return !!token;
};

/**
 * Get current auth token
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

/**
 * Handle API errors
 */
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Return error message from server if available
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    
    // Return generic error based on status code
    switch (axiosError.response?.status) {
      case 400:
        return 'Invalid request data';
      case 401:
        return 'Unauthorized - please login';
      case 403:
        return 'Access forbidden';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error - please try again';
      default:
        return axiosError.message || 'An error occurred';
    }
  }
  
  return 'An unexpected error occurred';
};

// ============================================
// EXPORT API CLIENT
// ============================================
export default api;
