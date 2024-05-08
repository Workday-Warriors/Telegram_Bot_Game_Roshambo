/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.fallback = {fs: false};
    
    return config;
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/dashboard/console",
        permanent: true,
      }
    ];
  },
};

module.exports = nextConfig;
