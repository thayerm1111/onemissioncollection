import type { Config } from "tailwindcss";

/**
 * One Mission Collection — minimalist editorial storefront.
 * Palette is intentionally near-monochrome (white / ink / soft gray).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101010",
        paper: "#ffffff",
        stone: "#f4f4f2", // product tile background
        mute: "#8a8a8a", // secondary text
        line: "#e7e7e4", // hairline borders
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider2: "0.14em",
        widest2: "0.22em",
      },
      maxWidth: {
        site: "1600px",
      },
    },
  },
  plugins: [],
};

export default config;
