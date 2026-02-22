// ============================================
// HalalMap Georgia - Filters Component
// Filter controls for place type and distance
// ============================================

'use client';

import type { PlaceFilters, PlaceType } from '@/lib/types';

interface FiltersProps {
  filters: PlaceFilters;
  onChange: (filters: PlaceFilters) => void;
  placeCount: number;
}

export default function Filters({ filters, onChange, placeCount }: FiltersProps) {
  const handleTypeChange = (type: PlaceType | 'all') => {
    onChange({ ...filters, type });
  };

  const handleDistanceChange = (distance: number) => {
    onChange({ ...filters, distance });
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', padding: '16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111111', margin: '0 0 4px 0' }}>Filters</h2>
        <p style={{ fontSize: '14px', color: '#666666', margin: '0' }}>{placeCount} places found</p>
      </div>

      {/* Type Filter */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <button
            onClick={() => handleTypeChange('all')}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filters.type === 'all' ? '#16a34a' : '#f3f4f6',
              color: filters.type === 'all' ? 'white' : '#374151',
              transition: 'all 200ms',
            }}
          >
            All
          </button>
          <button
            onClick={() => handleTypeChange('restaurant')}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filters.type === 'restaurant' ? '#16a34a' : '#f3f4f6',
              color: filters.type === 'restaurant' ? 'white' : '#374151',
              transition: 'all 200ms',
            }}
          >
            🍽️ Food
          </button>
          <button
            onClick={() => handleTypeChange('mosque')}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filters.type === 'mosque' ? '#16a34a' : '#f3f4f6',
              color: filters.type === 'mosque' ? 'white' : '#374151',
              transition: 'all 200ms',
            }}
          >
            🕌 Mosque
          </button>
        </div>
      </div>

      {/* Distance Filter */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
          Distance: {filters.distance >= 1000 
            ? `${(filters.distance / 1000).toFixed(0)} km`
            : `${filters.distance} m`}
        </label>
        <input
          type="range"
          min="1000"
          max="25000"
          step="1000"
          value={filters.distance}
          onChange={(e) => handleDistanceChange(parseInt(e.target.value))}
          style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', appearance: 'none', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666666', marginTop: '4px' }}>
          <span>1 km</span>
          <span>25 km</span>
        </div>
      </div>
    </div>
  );
}
