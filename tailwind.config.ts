import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace"
        ]
      },
      colors: {
        terminal: {
          bg: "rgb(var(--color-terminal-bg) / <alpha-value>)",
          panel: "rgb(var(--color-terminal-panel) / <alpha-value>)",
          border: "rgb(var(--color-terminal-border) / <alpha-value>)",
          text: "rgb(var(--color-terminal-text) / <alpha-value>)",
          accent: "rgb(var(--color-terminal-accent) / <alpha-value>)",
          amber: "rgb(var(--color-terminal-amber) / <alpha-value>)"
        }
      },
      boxShadow: {
        terminal: "var(--terminal-shadow)"
      }
    }
  },
  plugins: []
};

export default config;
