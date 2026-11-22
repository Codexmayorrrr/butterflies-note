/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#E3D2B4",
        "charcoal-muted": "#5C5C5C",
      },
      fontFamily: {
        corsiva: ['"Monotype Corsiva"', 'cursive', 'serif'],
      },
      lineHeight: {
        letter: '19px',
      },
    },
  },
  plugins: [],
}
