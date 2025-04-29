import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'test-api-administracion.synersol.mx',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
}

export default nextConfig;
