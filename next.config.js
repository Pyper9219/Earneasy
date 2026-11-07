<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["mongoose", "bcryptjs"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.flutterwave.com" },
    ],
  },
};

=======
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["mongoose", "bcryptjs"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.flutterwave.com" },
    ],
  },
};

>>>>>>> 33073f7 (Initial commit)
module.exports = nextConfig;