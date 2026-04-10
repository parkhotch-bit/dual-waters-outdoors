/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#0B1F17",
          dark: "#070F0C",
          card: "#112219",
        },
        moss: {
          DEFAULT: "#1F6B47",
          light: "#2d9966",
        },
        amber: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
        },
        earth: {
          DEFAULT: "#8B5E3C",
          light: "#A67C5B",
        },
        offwhite: "#F0EDE6",
        slate: "#7A9088",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#F0EDE6",
            a: { color: "#F59E0B" },
            h1: { color: "#F0EDE6", fontFamily: "'Playfair Display', serif" },
            h2: { color: "#F0EDE6", fontFamily: "'Playfair Display', serif" },
            h3: { color: "#F0EDE6" },
            strong: { color: "#F0EDE6" },
            blockquote: { color: "#7A9088", borderLeftColor: "#1F6B47" },
            code: { color: "#F59E0B" },
            hr: { borderColor: "#1F6B47" },
          },
        },
      },
    },
  },
  plugins: [],
};
