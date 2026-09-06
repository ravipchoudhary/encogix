/** @type {import('next').NextConfig} */
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.join(__dirname, ".env");
if (fs.existsSync(rootEnvPath)) {
  for (const line of fs.readFileSync(rootEnvPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
  }
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

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