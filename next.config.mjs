/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Increase body size limit for API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year for production
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development' ? false : false,
  },
  // Compression
  compress: true,
  // Production optimizations
  swcMinify: true,
  // React strict mode
  reactStrictMode: true,
  // Power optimization
  poweredByHeader: false,
  // Production optimizations
  productionBrowserSourceMaps: false,
  // Optimize fonts
  optimizeFonts: true,
  // Generate ETags
  generateEtags: true,
};

export default nextConfig;
