// ============================================
// HalalMap Georgia - React Leaflet Map Component
// Interactive map with markers and popups using OpenStreetMap
// ============================================

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Place, Coordinates } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ============================================
// CUSTOM MARKER ICONS
// Create custom icons for different place types
// ============================================
const createCustomIcon = (type: 'restaurant' | 'mosque', verified: boolean = false) => {
  const emoji = type === 'restaurant' ? '🍽️' : '🕌';
  const bgColor = type === 'restaurant' ? '#fef3c7' : '#dbeafe';
  const borderColor = verified ? '#22c55e' : '#d1d5db';

  const svgIcon = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="18" fill="${bgColor}" stroke="${borderColor}" stroke-width="2" filter="url(#shadow)"/>
      <text x="20" y="28" font-size="20" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
      ${verified ? `<circle cx="30" cy="10" r="6" fill="#22c55e" stroke="white" stroke-width="1"/>
                    <text x="30" y="13" font-size="8" text-anchor="middle" dominant-baseline="middle" fill="white" font-weight="bold">✓</text>` : ''}
    </svg>
  `;

  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgIcon)}`;

  return L.icon({
    iconUrl: dataUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// ============================================
// USER LOCATION MARKER ICON
// ============================================
const userLocationIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjM2I4MmY2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// ============================================
// MAP CONTROLLER COMPONENT
// Internal component to control map behavior
// ============================================
interface MapControllerProps {
  center: Coordinates;
  places: Place[];
  selectedPlace: Place | null;
  userLocation: Coordinates | null;
  onPlaceSelect: (place: Place) => void;
}

const MapController: React.FC<MapControllerProps> = ({
  center,
  places,
  selectedPlace,
  userLocation,
  onPlaceSelect,
}) => {
  const map = useMap();
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Pan to center when it changes
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), {
      animate: true,
      duration: 1,
    });
  }, [center, map]);

  // Update user location marker
  useEffect(() => {
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }

    if (userLocation) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userLocationIcon,
      }).addTo(map);

      userMarkerRef.current.bindPopup(`
        <div style="padding: 8px; text-align: center;">
          <p style="margin: 0; font-weight: 600; color: #111;">Your Location</p>
        </div>
      `);
    }
  }, [userLocation, map]);

  return null;
};

// ============================================
// MAP COMPONENT PROPS
// ============================================
interface MapProps {
  center: Coordinates;
  places: Place[];
  selectedPlace: Place | null;
  userLocation: Coordinates | null;
  onPlaceSelect: (place: Place) => void;
}

// ============================================
// MAP COMPONENT
// ============================================
export default function Map({
  center,
  places,
  selectedPlace,
  userLocation,
  onPlaceSelect,
}: MapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderWidth: '4px', borderColor: '#e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '16px', color: '#4b5563' }}>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb' }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
        className="leaflet-container z-0"
      >
        {/* Tile Layer - OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {/* Map Controller */}
        <MapController
          center={center}
          places={places}
          selectedPlace={selectedPlace}
          userLocation={userLocation}
          onPlaceSelect={onPlaceSelect}
        />

        {/* Zoom Control */}
        <ZoomControl position="bottomright" />

        {/* Place Markers */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={createCustomIcon(place.type, place.verified)}
            eventHandlers={{
              click: () => {
                onPlaceSelect(place);
              },
            }}
          >
            <Popup className="custom-popup" maxWidth={280}>
              <div style={{ padding: '12px' }}>
                {/* Title */}
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {place.name}
                  {place.verified && (
                    <span style={{ color: '#22c55e', fontSize: '16px' }}>✓</span>
                  )}
                </h3>

                {/* Type badge */}
                <div style={{ marginBottom: '8px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      background:
                        place.type === 'restaurant' ? '#fef3c7' : '#dbeafe',
                      color:
                        place.type === 'restaurant' ? '#92400e' : '#1e40af',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {place.type === 'restaurant' ? '🍽️ Restaurant' : '🕌 Mosque'}
                  </span>
                </div>

                {/* Address */}
                {place.address && (
                  <p
                    style={{
                      margin: '6px 0',
                      fontSize: '14px',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '6px',
                    }}
                  >
                    <span>📍</span>
                    <span>{place.address}</span>
                  </p>
                )}

                {/* Phone */}
                {place.phone && (
                  <p
                    style={{
                      margin: '6px 0',
                      fontSize: '14px',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>📞</span>
                    <a
                      href={`tel:${place.phone}`}
                      style={{
                        color: '#2563eb',
                        textDecoration: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {place.phone}
                    </a>
                  </p>
                )}

                {/* Website */}
                {place.website && (
                  <p
                    style={{
                      margin: '6px 0',
                      fontSize: '14px',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🌐</span>
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#2563eb',
                        textDecoration: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Visit Website
                    </a>
                  </p>
                )}

                {/* Distance */}
                {place.distance_text && (
                  <p
                    style={{
                      margin: '6px 0',
                      fontSize: '14px',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>📏</span>
                    <span>{place.distance_text} away</span>
                  </p>
                )}

                {/* Get Directions Button */}
                <div style={{ marginTop: '12px' }}>
                  <a
                    href={`https://www.openstreetmap.org/directions?engine=osrm_car&route=${userLocation?.lat || center.lat},${userLocation?.lng || center.lng};${place.latitude},${place.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      background: '#22c55e',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div style={{ padding: '8px', textAlign: 'center' }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: '600',
                    color: '#111',
                  }}
                >
                  Your Location
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm z-20 pointer-events-auto">
        <div className="space-y-2">
          <p className="font-semibold text-gray-700 pb-2 border-b">
            Map Legend
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🍽️</span>
            <span>Restaurant</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🕌</span>
            <span>Mosque</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Your Location</span>
          </div>
        </div>
      </div>

      {/* Custom Leaflet Styles */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .leaflet-popup-tip {
          background: white;
        }

        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
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
