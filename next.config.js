require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/multisig',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
