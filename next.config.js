/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'customer-e0ksx71mz4nqibcu.cloudflarestream.com',
    ],
  },
};

module.exports = nextConfig;
