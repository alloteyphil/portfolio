import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#0d0d0d",
          panel: "#111111",
          border: "#2a2a2a",
          text: "#d8e4c8",
          accent: "#86efac",
          amber: "#fbbf24"
        }
      },
      boxShadow: {
        terminal: "0 0 0 1px #2a2a2a, 0 24px 50px rgba(0, 0, 0, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
