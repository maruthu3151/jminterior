/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#D4AF37',
          500: '#C5A059',
          600: '#B08B3E',
          700: '#8C6C26',
        },
        charcoal: {
          900: '#121212',
          800: '#1A1A1A',
          700: '#242424',
          600: '#2E2E2E',
        },
        bronze: {
          500: '#A37938',
          600: '#876127',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(197, 160, 89, 0.25)',
        'gold-sm': '0 0 10px rgba(197, 160, 89, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #C5A059 50%, #8C6C26 100%)',
        'dark-glass': 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(18, 18, 18, 0.9) 100%)',
      }
    },
  },
  plugins: [],
}
