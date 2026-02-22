// ============================================
// HalalMap Georgia - Map Context
// Shared state management for map and places
// ============================================

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Place, Coordinates } from '@/lib/types';

// ============================================
// CONTEXT TYPES
// ============================================
interface MapContextType {
  // Places data
  places: Place[];
  selectedPlace: Place | null;
  
  // Map state
  center: Coordinates;
  userLocation: Coordinates | null;
  
  // Actions
  setPlaces: (places: Place[]) => void;
  setSelectedPlace: (place: Place | null) => void;
  setCenter: (center: Coordinates) => void;
  setUserLocation: (location: Coordinates | null) => void;
  
  // Derived actions
  addPlace: (place: Place) => void;
  removePlace: (id: number) => void;
  updatePlace: (id: number, place: Place) => void;
}

// ============================================
// CREATE CONTEXT
// ============================================
const MapContext = createContext<MapContextType | undefined>(undefined);

// ============================================
// EXPORT HOOK
// ============================================
export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within MapProvider');
  }
  return context;
};

// ============================================
// PROVIDER COMPONENT
// ============================================
interface MapProviderProps {
  children: React.ReactNode;
  initialCenter?: Coordinates;
}

export const MapProvider: React.FC<MapProviderProps> = ({
  children,
  initialCenter = { lat: 41.7151, lng: 44.8271 },
}) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [center, setCenter] = useState<Coordinates>(initialCenter);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  // ============================================
  // DERIVED ACTIONS
  // ============================================
  const addPlace = useCallback((place: Place) => {
    setPlaces((prev) => [...prev, place]);
  }, []);

  const removePlace = useCallback((id: number) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
    if (selectedPlace?.id === id) {
      setSelectedPlace(null);
    }
  }, [selectedPlace]);

  const updatePlace = useCallback((id: number, updatedPlace: Place) => {
    setPlaces((prev) =>
      prev.map((p) => (p.id === id ? updatedPlace : p))
    );
    if (selectedPlace?.id === id) {
      setSelectedPlace(updatedPlace);
    }
  }, [selectedPlace]);

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value: MapContextType = {
    places,
    selectedPlace,
    center,
    userLocation,
    setPlaces,
    setSelectedPlace,
    setCenter,
    setUserLocation,
    addPlace,
    removePlace,
    updatePlace,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};
