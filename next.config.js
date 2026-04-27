/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for Cloudflare Pages with edge runtime, but
  // we mostly use static + ISR. Tweak per page as needed.
};

module.exports = nextConfig;
