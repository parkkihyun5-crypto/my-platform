import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },

  async redirects() {
    return [
      {
        source: "/family-foundation",
        destination: "/heritage-office",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/parkkihyun-profile",
        destination: "/parkkihyun-profile.html",
      },
    ];
  },
};

export default nextConfig;