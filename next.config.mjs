/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true, // এটি নতুন যুক্ত হলো
};

export default nextConfig;
