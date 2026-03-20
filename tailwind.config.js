/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['"Fredoka One"', 'cursive'],
      },
      colors: {
        brand: {
          yellow: '#FFD700',
          blue: '#1E40AF',
        }
      }
    },
  },
  plugins: [],
}
