// ============================================
// HalalMap Georgia - Root Layout
// Main layout wrapper for the entire application
// ============================================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// ============================================
// FONT CONFIGURATION
// Use Inter as the default font
// ============================================
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// ============================================
// METADATA CONFIGURATION
// SEO and Open Graph tags
// ============================================
export const metadata: Metadata = {
  title: 'HalalMap Georgia - Find Halal Restaurants & Mosques',
  description: 'Discover halal restaurants and mosques across Georgia. Your trusted guide to halal dining and prayer locations in Tbilisi, Batumi, and beyond.',
  keywords: ['halal', 'restaurants', 'mosques', 'Georgia', 'Tbilisi', 'Batumi', 'Muslim', 'Islamic'],
  authors: [{ name: 'HalalMap Georgia Team' }],
  
  // Open Graph metadata for social sharing
  openGraph: {
    title: 'HalalMap Georgia - Find Halal Restaurants & Mosques',
    description: 'Discover halal restaurants and mosques across Georgia',
    url: 'https://halalmap.ge',
    siteName: 'HalalMap Georgia',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HalalMap Georgia',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'HalalMap Georgia',
    description: 'Discover halal restaurants and mosques across Georgia',
    images: ['/og-image.jpg'],
  },
  
  // Verification tags (add your verification codes)
  // verification: {
  //   google: 'google-site-verification-code',
  // },
  
  // App metadata
  applicationName: 'HalalMap Georgia',
  
  // Manifest for PWA support
  manifest: '/manifest.json',
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  
  // Viewport configuration
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

// ============================================
// ROOT LAYOUT COMPONENT
// ============================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Additional head tags can be added here */}
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      
      <body className={`${inter.className} antialiased h-full`}>
        {/* Main content */}
        <main className="h-full">
          {children}
        </main>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
            },
            // Success toast style
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            // Error toast style
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
