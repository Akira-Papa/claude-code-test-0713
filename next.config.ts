import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Disable strict mode for dynamic routes to avoid the routing error
    strictNextHead: false,
  },
  // Add rewrites to handle the problematic route pattern
  async rewrites() {
    return [
      {
        source: '/api/posts/:path*',
        destination: '/api/posts/:path*',
      },
    ];
  },
};

export default nextConfig;
