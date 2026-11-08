/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["mongoose", "bcryptjs", "nodemailer"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.flutterwave.com" },
    ],
  },
};

module.exports = nextConfig;
