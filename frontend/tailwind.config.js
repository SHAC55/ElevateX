/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'txl': '1613px', // use for hero section text
        'hlg': '1469px',
        'hmd': '800px',
      },
    },
  },
  plugins: [],
}
