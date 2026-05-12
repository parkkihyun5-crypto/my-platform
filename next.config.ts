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
        source: "/parkkihyun/",
        destination: "/parkkihyun",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;