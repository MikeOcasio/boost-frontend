/** @type {import('next').NextConfig} */
const nextConfig = {
  // allow image from any host
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },

  // body size limit to 3 MB
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  }
};

export default nextConfig;
