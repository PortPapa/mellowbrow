import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // design-system/ is a reference bundle, not part of the build
  outputFileTracingExcludes: { "*": ["./design-system/**"] },
};

export default nextConfig;
