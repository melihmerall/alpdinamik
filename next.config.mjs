/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Increase body size limit for API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
};

export default nextConfig;
