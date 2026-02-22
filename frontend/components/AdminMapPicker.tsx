// ============================================
// HalalMap Georgia - Admin Map Picker Component
// Interactive map for selecting restaurant coordinates
// ============================================

'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Coordinates } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ============================================
// MAP COORDINATOR COMPONENT
// Internal component to handle map click and coordinate synchronization
// ============================================
interface MapCoordinatorProps {
  coordinates: Coordinates;
  onCoordinatesChange: (coords: Coordinates) => void;
}

const MapCoordinator: React.FC<MapCoordinatorProps> = ({
  coordinates,
  onCoordinatesChange,
}) => {
  const map = useMap();

  // Handle map clicks
  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    onCoordinatesChange({ lat, lng });
  };

  React.useEffect(() => {
    if (map) {
      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [map]);

  return null;
};

// ============================================
// ADMIN MAP PICKER PROPS
// ============================================
interface AdminMapPickerProps {
  coordinates: Coordinates;
  onCoordinatesChange: (coords: Coordinates) => void;
  defaultCenter?: Coordinates;
}

// ============================================
// ADMIN MAP PICKER COMPONENT
// ============================================
export default function AdminMapPicker({
  coordinates,
  onCoordinatesChange,
  defaultCenter = { lat: 41.7151, lng: 44.8271 },
}: AdminMapPickerProps) {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Map container */}
      <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
        <MapContainer
          center={[
            coordinates.lat || defaultCenter.lat,
            coordinates.lng || defaultCenter.lng,
          ]}
          zoom={14}
          zoomControl={false}
          style={{ width: '100%', height: '300px' }}
        >
          {/* Tile Layer - OpenStreetMap */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />

          {/* Zoom Control */}
          <ZoomControl position="topright" />

          {/* Marker for selected location */}
          {coordinates.lat && coordinates.lng && (
            <Marker position={[coordinates.lat, coordinates.lng]}>
              <Popup>
                <div style={{ padding: '8px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#111', marginBottom: '8px' }}>
                    Restaurant Location
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                    Lat: {coordinates.lat.toFixed(6)}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                    Lng: {coordinates.lng.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Map Coordinator for handling clicks */}
          <MapCoordinator
            coordinates={coordinates}
            onCoordinatesChange={onCoordinatesChange}
          />
        </MapContainer>

        {/* Help text overlay */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-xs text-gray-700 p-2 rounded shadow">
          Click on the map to select a location
        </div>
      </div>

      {/* Coordinate inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label text-sm">Latitude</label>
          <input
            type="number"
            step="any"
            value={coordinates.lat || ''}
            onChange={(e) =>
              onCoordinatesChange({
                ...coordinates,
                lat: parseFloat(e.target.value),
              })
            }
            className="input w-full"
            placeholder="41.7151"
          />
        </div>
        <div>
          <label className="label text-sm">Longitude</label>
          <input
            type="number"
            step="any"
            value={coordinates.lng || ''}
            onChange={(e) =>
              onCoordinatesChange({
                ...coordinates,
                lng: parseFloat(e.target.value),
              })
            }
            className="input w-full"
            placeholder="44.8271"
          />
        </div>
      </div>

      {/* Coordinate display */}
      {coordinates.lat && coordinates.lng && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          📍 Selected: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .leaflet-popup-tip {
          background: white;
        }

        .leaflet-control-zoom {
          border: 2px solid #ddd;
          border-radius: 4px;
        }

        .leaflet-control-zoom a {
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 18px;
          border: none;
        }

        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          background-color: white;
          color: #333;
          font-weight: bold;
        }

        .leaflet-control-zoom-in:hover,
        .leaflet-control-zoom-out:hover {
          background-color: #f0f0f0;
          color: #000;
        }
      `}</style>
    </div>
  );
}
