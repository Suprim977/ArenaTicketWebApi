import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
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
