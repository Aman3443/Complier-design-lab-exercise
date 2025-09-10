/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = nextConfig;