/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      colors: {
        background: '#F8F6F1', // Warm off-white / cream
        primary: {
          50: '#F0F4F2',
          100: '#E1E9E4',
          200: '#C4D5CB',
          300: '#A7C4A0', // Soft sage green (Secondary)
          400: '#6FA48C',
          500: '#3D7760',
          600: '#1F533E',
          700: '#0F3D2E', // Deep emerald green (Primary)
          800: '#0A2B20',
          900: '#061C14',
        },
        accent: {
          light: '#DFCFAB',
          DEFAULT: '#C8A96A', // Muted gold
          dark: '#B18E4E',
        },
        charcoal: {
          DEFAULT: '#1F2933',
        },
        softgray: {
          DEFAULT: '#6B7280',
        }
      },
      backgroundImage: {
        'islamic-pattern': "url('/pattern.png')",
        'cream-gradient': 'linear-gradient(135deg, #F8F6F1 0%, #FDFCF9 100%)',
        'dark-green-gradient': 'linear-gradient(135deg, #0A2B20 0%, #0F3D2E 100%)',
      }
    },
  },
  plugins: [],
}
