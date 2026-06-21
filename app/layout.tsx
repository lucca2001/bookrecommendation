import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "书格测评 — 你是哪种读书人？",
  description: "16种阅读人格，总有一种说的是你。5分钟测出你的书格，获得专属图书推荐。",
  keywords: ["读书", "图书推荐", "MBTI", "阅读人格", "书格"],
  openGraph: {
    title: "书格测评 — 你是哪种读书人？",
    description: "16种阅读人格，总有一种说的是你。",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0f0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
