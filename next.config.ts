import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Optimize for production and reduce bundle size
  compress: true,
  poweredByHeader: false,
  // Externalize large dependencies to reduce Worker bundle
  experimental: {
    serverComponentsExternalPackages: [
      'axios',
      'date-fns',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iili.io',
      },
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudflare.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
