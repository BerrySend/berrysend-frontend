/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'berry-blue': '#3b82f6',
        'berry-purple': '#9333ea',
        'berry-teal': '#14b8a6',
      }
    },
  },
  plugins: [],
}