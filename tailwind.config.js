/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#f3ead8",
        ink: "#1b2231",
        navy: "#0f1a2e",
        gold: "#b89046",
        "gold-light": "#d4a85a",
        "navy-light": "#243250",
        crimson: "#7a1e1e",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
