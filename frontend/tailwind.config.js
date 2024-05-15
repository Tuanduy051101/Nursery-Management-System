/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.capitalize': {
          'text-transform': 'capitalize',
        },
        '.first-letter-uppercase': {
          '&::first-letter': {
            'text-transform': 'uppercase',
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
}