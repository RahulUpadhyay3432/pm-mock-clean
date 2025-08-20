// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // TEMPORARY: allow production builds to complete even if ESLint errors exist.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
