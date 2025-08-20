import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Safety valve so builds never block. We still write proper types.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;