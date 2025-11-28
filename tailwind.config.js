/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mega: {
          yellow: '#FFA300',
          dark: '#333333',
          light: '#F5F5F5',
          white: '#FFFFFF',
        }
      }
    },
  },
  plugins: [],
}