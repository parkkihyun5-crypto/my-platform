import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/family-foundation",
        destination: "/heritage-office",
        permanent: true,
      },
      {
        source: "/parkkihyun-profile.html",
        destination: "/parkkihyun",
        permanent: true,
      },
      {
        source: "/parkkihyun/",
        destination: "/parkkihyun",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/parkkihyun",
        destination: "/parkkihyun-profile.html",
      },
    ];
  },
};

export default nextConfig;