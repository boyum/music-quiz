const withNx = require("@nrwl/next/plugins/with-nx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out",
  target: "serverless",
  reactStrictMode: true,
};

module.exports = withNx(nextConfig);
