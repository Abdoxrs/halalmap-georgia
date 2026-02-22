// ============================================
// HalalMap Georgia - Admin Layout
// Protected layout for admin pages
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, adminLogout } from '@/lib/api';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsChecking(false);

      if (!authenticated && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    adminLogout();
    router.push('/admin/login');
  };

  if (isChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderWidth: '4px', borderColor: '#e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#16a34a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>🕌</span>
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111111', margin: '0' }}>HalalMap Admin</h1>
            </Link>

            <nav style={{ display: 'none' }}>
              <Link href="/admin" style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', textDecoration: 'none', color: pathname === '/admin' ? '#15803d' : '#374151', backgroundColor: pathname === '/admin' ? '#f0fdf4' : 'transparent', marginRight: '8px' }}>
                Dashboard
              </Link>
              <Link href="/admin/places" style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', textDecoration: 'none', color: pathname === '/admin/places' ? '#15803d' : '#374151', backgroundColor: pathname === '/admin/places' ? '#f0fdf4' : 'transparent' }}>
                Places
              </Link>
            </nav>
          </div>

          <button onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#e5e7eb', color: '#111111', fontSize: '14px', fontWeight: '500', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>{children}</main>
    </div>
  );
}
