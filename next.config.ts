import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent.fpnh10-1.fna.fbcdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
