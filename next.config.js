/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
};
module.exports = nextConfig;
