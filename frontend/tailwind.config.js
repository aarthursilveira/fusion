/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fusion: {
          primary: '#7A3FA3', // deep violet
          accent: '#6DBF47',  // lime green
          bg: '#111827',     // dark
          card: '#1E1E30',   // card surface
          text: '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Barlow Condensed', 'sans-serif'],
      },
      boxShadow: {
        'fusion-glow': '0 0 24px rgba(122, 63, 163, 0.2)',
        'fusion-purple-glow': '0 0 15px rgba(122, 63, 163, 0.5)',
      }
    },
  },
  plugins: [],
}

