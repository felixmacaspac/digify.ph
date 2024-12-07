import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        DEFAULT: "1440px",
      },
    },
    extend: {
      colors: {
        primary: "#BDE8CA",
        secondary: "#FCFAEE",
        blue: "#2848B7",
        green: "#63CC63",
        black: "#322F2A",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
