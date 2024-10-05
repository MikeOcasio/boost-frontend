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
};

export default nextConfig;
