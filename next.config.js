/** @type {import('next').NextConfig} */

// GitHub Pages 项目站点托管在 https://<user>.github.io/<repo>/，
// 需要 basePath/assetPrefix 指向子路径；本地开发时为空。
// 由 CI 通过 NEXT_PUBLIC_BASE_PATH 注入（值形如 "/bookrecommend"）。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export", // 纯静态导出，产物在 out/，可直接托管于 GitHub Pages
  reactStrictMode: true,
  trailingSlash: true, // 生成 result/[slug]/index.html，子路径下路由更稳
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true, // 静态导出不支持 next/image 优化
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

module.exports = nextConfig;
