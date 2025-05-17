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
  experimental: {
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true
  },
  webpack: (config, { isServer }) => {
    // Handle document files
    config.module.rules.push({
      test: /\.(pdf|docx)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/documents/[name][ext]'
      }
    });

    return config;
  }
}

export default nextConfig
