/** @type {import('next').NextConfig} */
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

export default nextConfig
