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
};

export default nextConfig;