import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f0f",
        "bg-card": "#1a1a1a",
        "bg-hover": "#222222",
        text: "#f5f0e8",
        "text-muted": "#8a8070",
        accent: "#e8c547",
        border: "#2a2a2a",
      },
      fontFamily: {
        serif: ['Georgia', '"Noto Serif SC"', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
