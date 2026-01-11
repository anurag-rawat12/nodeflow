import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/workflow",
        permanent: false,
      },
    ];
  }
};

export default nextConfig;
