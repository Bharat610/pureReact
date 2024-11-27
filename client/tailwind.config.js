/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'teal': {
          DEFAULT: '#209b87',
          dark: '#008080'
        }
      },
      screens: {
        'desktop': '1350px'
      }
    },
  },
  plugins: [],
}

