/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          light: '#6B001A',
          DEFAULT: '#800020',
          dark: '#4A0010',
          deep: '#1A0005',
          gradient: '#3D0010',
        },
        beige: {
          light: '#F5F5DC',
          DEFAULT: '#E8DCC6',
          dark: '#D4C4A8',
        },
        gold: {
          light: '#FFD700',
          DEFAULT: '#D4AF37',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'glitter': 'glitter 3s linear infinite',
        'float-sparkle': 'floatSparkle 2s ease-in-out infinite',
      },
      keyframes: {
        glitter: {
          '0%': { backgroundPosition: '0% 50%', opacity: '0' },
          '50%': { opacity: '1', textShadow: '0 0 10px gold' },
          '100%': { backgroundPosition: '100% 50%', opacity: '0' },
        },
        floatSparkle: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
