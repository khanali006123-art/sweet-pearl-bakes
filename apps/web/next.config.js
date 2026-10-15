/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const apiTarget = process.env.API_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/v1/:path*',
        destination: ${apiTarget}/api/v1/:path*,
      },
      {
        source: '/uploads/:path*',
        destination: ${apiTarget}/uploads/:path*,
      },
    ];
  },
};

module.exports = nextConfig;