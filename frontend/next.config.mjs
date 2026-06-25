/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
  },

  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL || "https://encogix.onrender.com";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backend}/uploads/:path*`,
      },
    ];
  },

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;