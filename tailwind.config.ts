import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./services/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          indigo: "#6366F1",
          slate: "#0F172A",
          fog: "#F3F4F6",
        },
      },
      boxShadow: {
        card: "0 4px 20px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
