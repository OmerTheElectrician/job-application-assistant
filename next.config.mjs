/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone', // Add this for better deployment support
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        canvas: 'commonjs canvas',
        'pdf-parse': 'commonjs pdf-parse'
      });
    }
    return config;
  }
}

export default nextConfig;
