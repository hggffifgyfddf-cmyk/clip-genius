/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce build size
  swcMinify: true,
  productionBrowserSourceMaps: false,
  
  // Optimize images
  images: {
    unoptimized: true,
  },
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Standalone output for smaller builds
  output: 'standalone',
  
  // Optimize CSS
  experimental: {
    optimizeCss: true,
  },
  
  // Increase memory limit for build
  // This helps prevent heap out of memory errors
  poweredByHeader: false,
  
  // Disable telemetry
  distDir: '.next',
};

export default nextConfig;