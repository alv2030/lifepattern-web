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
        amber: "#FFF1D8"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(34, 34, 64, 0.10)"
      }
    }
  },
  plugins: []
};
export default config;
