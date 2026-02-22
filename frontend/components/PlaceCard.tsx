// ============================================
// HalalMap Georgia - Place Card Component
// Displays place information in a card format
// ============================================

'use client';

import type { Place } from '@/lib/types';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
  isSelected?: boolean;
}

export default function PlaceCard({ place, onClick, isSelected = false }: PlaceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`card p-4 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {place.name}
          {place.verified && (
            <span className="ml-2 text-green-600 text-sm">✓</span>
          )}
        </h3>
        <span className="text-2xl ml-2">
          {place.type === 'restaurant' ? '🍽️' : '🕌'}
        </span>
      </div>

      {/* City */}
      {place.city && (
        <p className="text-sm text-gray-600 mb-2">📍 {place.city}</p>
      )}

      {/* Distance */}
      {place.distance_text && (
        <p className="text-sm text-gray-600 mb-2">
          📏 {place.distance_text} away
        </p>
      )}

      {/* Type badge */}
      <div className="mt-2">
        <span
          className={`badge ${
            place.type === 'restaurant' ? 'badge-yellow' : 'badge-blue bg-blue-100 text-blue-800'
          }`}
        >
          {place.type === 'restaurant' ? 'Restaurant' : 'Mosque'}
        </span>
        {place.verified && (
          <span className="badge badge-green ml-2">Verified Halal</span>
        )}
      </div>

      {/* Directions button */}
      <a
        href={`https://www.openstreetmap.org/?mlon=${place.longitude}&mlat=${place.latitude}&zoom=16`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-3 btn-primary text-sm w-full text-center inline-block"
      >
        Get Directions →
      </a>
    </div>
  );
}
