/** @type {import('next').NextConfig} */

// ============================================
// HalalMap Georgia - Next.js Configuration
// ============================================

const nextConfig = {
  // Enable React Strict Mode for better error detection
  reactStrictMode: true,

  // Environment variables exposed to the browser
  // These must be prefixed with NEXT_PUBLIC_
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Image optimization configuration
  images: {
    domains: [
      'tile.openstreetmap.org',
      'a.tile.openstreetmap.org',
      'b.tile.openstreetmap.org',
      'c.tile.openstreetmap.org',
    ],
    // Enable image optimization
    unoptimized: false,
  },

  // Disable X-Powered-By header for security
  poweredByHeader: false,

  // Compression configuration
  compress: true,

  // Custom webpack configuration (if needed)
  webpack: (config, { isServer }) => {
    // Add custom webpack config here if needed
    return config;
  },

  // Experimental features (optional)
  experimental: {
    // Enable Server Actions (Next.js 14 feature)
    serverActions: {
      allowedOrigins: ['localhost:3000', 'halalmap.ge'],
    },
  },

  // Redirect configuration (optional)
  async redirects() {
    return [
      // Example: redirect /home to /
      // {
      //   source: '/home',
      //   destination: '/',
      //   permanent: true,
      // },
    ];
  },

  // Rewrites configuration (optional)
  async rewrites() {
    return [
      // Proxy API requests to backend in development
      // {
      //   source: '/api/:path*',
      //   destination: 'http://localhost:5000/api/:path*',
      // },
    ];
  },

  // Headers configuration for security
  async headers() {
    return [
      {
        // Apply headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
