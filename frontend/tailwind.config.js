/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#071A2E',
          800: '#0A2540',
          700: '#113052'
        },
        brand: {
          blue: '#2196F3',
          green: '#43A047',
          orange: '#FB8C00',
          red: '#E53935'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
