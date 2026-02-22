// ============================================
// HalalMap Georgia - Home Page
// Main page with interactive map and filters
// ============================================

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Filters from '@/components/Filters';
import PlaceCard from '@/components/PlaceCard';
import LocationButton from '@/components/LocationButton';
import { getNearbyPlaces, getAllPlaces } from '@/lib/api';
import type { Place, PlaceFilters, Coordinates } from '@/lib/types';
import toast from 'react-hot-toast';

// Dynamic import for Map component to prevent SSR issues
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

// ============================================
// DEFAULT COORDINATES (Tbilisi, Georgia)
// ============================================
const DEFAULT_CENTER: Coordinates = {
  lat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || '41.7151'),
  lng: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG || '44.8271'),
};

export default function HomePage() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Map center and user location
  const [center, setCenter] = useState<Coordinates>(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  
  // Places data
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  
  // Filters
  const [filters, setFilters] = useState<PlaceFilters>({
    type: 'all',
    distance: 5000, // 5km default
  });
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FETCH PLACES
  // Fetch places based on user location or show all
  // ============================================
  const fetchPlaces = async (location?: Coordinates) => {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      
      if (location) {
        // Fetch nearby places if location is available
        result = await getNearbyPlaces(
          location.lat,
          location.lng,
          filters.distance,
          filters.type !== 'all' ? filters.type : undefined
        );
        setPlaces(result.data);
        toast.success(`Found ${result.count} places nearby`);
      } else {
        // Fetch all places if no location
        result = await getAllPlaces({
          type: filters.type !== 'all' ? filters.type : undefined,
        });
        setPlaces(result.data);
      }
    } catch (err: any) {
      setError('Failed to load places. Please try again.');
      toast.error('Failed to load places');
      console.error('Error fetching places:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // GET USER LOCATION
  // Request geolocation permission and get coordinates
  // ============================================
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        setUserLocation(location);
        setCenter(location);
        fetchPlaces(location);
        
        toast.success('Location found!');
      },
      (error) => {
        console.error('Geolocation error:', error);
        
        // Show appropriate error message
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('Failed to get your location');
        }
        
        // Load all places as fallback
        fetchPlaces();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ============================================
  // HANDLE FILTER CHANGES
  // ============================================
  const handleFilterChange = (newFilters: PlaceFilters) => {
    setFilters(newFilters);
    fetchPlaces(userLocation || undefined);
  };

  // ============================================
  // HANDLE PLACE SELECTION
  // ============================================
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setCenter({ lat: place.latitude, lng: place.longitude });
  };

  // ============================================
  // INITIAL DATA LOAD
  // Load all places on mount
  // ============================================
  useEffect(() => {
    fetchPlaces();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'white' }}>
      {/* ==================== MAP ==================== */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Map
          center={center}
          places={places}
          selectedPlace={selectedPlace}
          userLocation={userLocation}
          onPlaceSelect={handlePlaceSelect}
        />
      </div>

      {/* ==================== HEADER ==================== */}
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo and title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#16a34a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>🕌</span>
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111111', margin: '0' }}>HalalMap Georgia</h1>
              <p style={{ fontSize: '12px', color: '#666666', margin: '0' }}>Find Halal Food & Prayer Places</p>
            </div>
          </div>

          {/* Admin link */}
          <a
            href="/admin"
            style={{ fontSize: '14px', color: '#16a34a', textDecoration: 'none', fontWeight: '500', cursor: 'pointer' }}
          >
            Admin Panel
          </a>
        </div>
      </header>

      {/* ==================== FILTERS PANEL ==================== */}
      <div style={{ position: 'absolute', top: '80px', left: '16px', zIndex: 20, width: '320px', maxWidth: '100%' }}>
        <Filters
          filters={filters}
          onChange={handleFilterChange}
          placeCount={places.length}
        />
      </div>

      {/* ==================== LOCATION BUTTON ==================== */}
      <div style={{ position: 'absolute', top: '80px', right: '16px', zIndex: 20 }}>
        <LocationButton
          onClick={getUserLocation}
          isActive={!!userLocation}
          isLoading={isLoading}
        />
      </div>

      {/* ==================== PLACES LIST (Mobile) ==================== */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, display: 'none', '@media (max-width: 768px)': { display: 'block' }, backgroundColor: 'white', maxHeight: '256px', overflowY: 'auto' }}>
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px' }}>
            <div style={{ animation: 'spin 1s linear infinite' }}></div>
            <span style={{ marginLeft: '8px' }}>Loading places...</span>
          </div>
        )}
        
        {!isLoading && places.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#666666' }}>
            No places found. Try adjusting your filters.
          </div>
        )}
        
        {!isLoading && places.length > 0 && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {places.slice(0, 5).map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onClick={() => handlePlaceSelect(place)}
                isSelected={selectedPlace?.id === place.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ==================== SIDEBAR (Desktop) ==================== */}
      <aside style={{ position: 'absolute', top: '80px', right: '16px', bottom: '16px', zIndex: 20, width: '384px', display: 'none' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Sidebar header */}
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111111', margin: '0' }}>
              {places.length} {filters.type === 'all' ? 'Places' : 
               filters.type === 'restaurant' ? 'Restaurants' : 'Mosques'}
            </h2>
          </div>

          {/* Places list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '48px' }}>
                <div style={{ animation: 'spin 1s linear infinite' }}></div>
                <span style={{ marginTop: '16px', color: '#666666' }}>Loading places...</span>
              </div>
            )}
            
            {!isLoading && places.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: '48px' }}>
                <p style={{ color: '#666666' }}>No places found</p>
                <p style={{ fontSize: '14px', color: '#999999', marginTop: '8px' }}>
                  Try adjusting your filters or location
                </p>
              </div>
            )}
            
            {!isLoading && places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onClick={() => handlePlaceSelect(place)}
                isSelected={selectedPlace?.id === place.id}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* ==================== LOADING OVERLAY ==================== */}
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          {/* Loading indicator on map */}
        </div>
      )}
    </div>
  );
}
