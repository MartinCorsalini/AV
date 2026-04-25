/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0f0f0f',
          secondary: '#1a1a1a',
          card: '#212121',
          border: '#2a2a2a',
        },
        accent: {
          green: '#22c55e',
          red: '#ef4444',
          amber: '#f59e0b',
          blue: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}