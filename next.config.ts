import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',

  // GitHub Pages requires this for proper image handling
  images: {
    unoptimized: true,
  },

  // If deploying to a repo (not username.github.io), uncomment and set your repo name:
  // basePath: '/math_jenga',
  assetPrefix: '/math_jenga',
};

export default nextConfig;
