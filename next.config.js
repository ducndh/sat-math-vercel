/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*.vercel.app', '*.blob.vercel-storage.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig