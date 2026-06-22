import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151527",
        mist: "#F7F6F2",
        cloud: "#FFFFFF",
        muted: "#6D7280",
        indigo: "#332E7E",
        lavender: "#E9E7FF",
        sage: "#DDEBDD",
        amber: "#FFF1D8",
        // Japanese palette
        gold: "#B68A5A",
        "gold-dark": "#8A6238",
        peach: "#E8A87C",
        parchment: "#FBF4EF",
        sand: "#E8DDD2",
        "warm-ink": "#1E1B18",
        "warm-muted": "#6F675F",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(34, 34, 64, 0.10)",
        gold: "0 16px 48px rgba(182, 138, 90, 0.18)",
      }
    }
  },
  plugins: []
};
export default config;
