import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@almosafar/shared", "@almosafar/ui", "@almosafar/demo-core", "@almosafar/maps"],
  reactStrictMode: true,
};

export default nextConfig;
