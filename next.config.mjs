/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  skipTrailingSlashRedirect: true
};

export default nextConfig;
