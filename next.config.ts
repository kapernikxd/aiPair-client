// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  images: { unoptimized: true }, // иначе картинки не прогрузятся на чистом экспорте
};
export default nextConfig;