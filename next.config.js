/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3003", "habit-tracker-pro.vercel.app"]
    }
  }
}

module.exports = nextConfig