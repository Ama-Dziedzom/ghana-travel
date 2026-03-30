/** @type {import('next').NextConfig} */
import { withContentlayer } from 'next-contentlayer2'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        // Supabase Storage — covers all projects (*.supabase.co)
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

export default withContentlayer(nextConfig)