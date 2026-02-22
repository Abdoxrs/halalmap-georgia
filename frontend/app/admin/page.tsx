'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/lib/api';
import type { DashboardStats } from '@/lib/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '48px' }}>
        <div style={{ width: '40px', height: '40px', borderWidth: '4px', borderColor: '#e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111111', marginBottom: '32px' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#111111' }}>{stats?.overview.total_places || 0}</div>
          <div style={{ color: '#666666' }}>Total Places</div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🍽️</div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#111111' }}>{stats?.overview.restaurants || 0}</div>
          <div style={{ color: '#666666' }}>Restaurants</div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🕌</div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#111111' }}>{stats?.overview.mosques || 0}</div>
          <div style={{ color: '#666666' }}>Mosques</div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#22c55e' }}>{stats?.overview.verified || 0}</div>
          <div style={{ color: '#666666' }}>Verified</div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#eab308' }}>{stats?.overview.unverified || 0}</div>
          <div style={{ color: '#666666' }}>Pending</div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏙️</div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#111111' }}>{stats?.overview.cities || 0}</div>
          <div style={{ color: '#666666' }}>Cities</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recent Additions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats?.recent_additions.map((place) => (
              <div key={place.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{place.name}</div>
                  <div style={{ fontSize: '14px', color: '#666666' }}>{place.city}</div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: place.type === 'restaurant' ? '#fef3c7' : '#dbeafe', color: place.type === 'restaurant' ? '#92400e' : '#075985', fontSize: '12px', fontWeight: '500' }}>
                  {place.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Top Cities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats?.top_cities.map((city) => (
              <div key={city.city} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                <div style={{ fontWeight: '500' }}>{city.city}</div>
                <div style={{ color: '#666666' }}>{city.count} places</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
