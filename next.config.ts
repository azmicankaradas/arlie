import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel deploy — standalone output for optimized serverless functions
  output: "standalone",

  // Güvenlik: X-Powered-By header'ını gizle
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Production'da Supabase storage görselleri için izin
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rncqldaimvumtjoyxtzk.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
