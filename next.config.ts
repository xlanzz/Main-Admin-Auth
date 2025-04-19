import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Fix baileys and websocket issues with Next.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        "utf-8-validate": false,
        "bufferutil": false,
      };
    }

    return config;
  },
  // Prevent errors from WebRTC and other browser APIs
  experimental: {
  },
  // Packages to exclude from bundling
  serverExternalPackages: ['baileys', 'ws'],
};

export default nextConfig;
