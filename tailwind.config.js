/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // FL palette: ocean teal + sand + storm
        sand: "#F5EFE0",
        ocean: "#0E6E78",
        deep: "#0A3D40",
        coral: "#E8743C",
        slate: "#1F2A2E",
      },
      fontFamily: {
        display: ['"Fraunces"', "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
