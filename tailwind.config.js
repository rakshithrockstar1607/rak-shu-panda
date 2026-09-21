/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          950: '#140103',
          900: '#260206',
          850: '#38040a',
          800: '#4d050d',
          750: '#630812',
          700: '#7c0c17',
          600: '#99111e',
          500: '#b81726',
        },
        gold: {
          200: '#fbf0b9',
          300: '#f5de7a',
          400: '#e5c453',
          500: '#d4af37',
          600: '#b38f24',
          700: '#8b6c16',
        },
        ivory: {
          50: '#fcfaf6',
          100: '#f8f4ec',
          200: '#eee6d4',
          300: '#dfd4bc',
          400: '#bfaf92',
          500: '#9e8c6e',
        },
      },
      fontFamily: {
        heading: ['"Slackey"', 'cursive', 'sans-serif'],
        serif: ['"Slackey"', 'cursive', 'sans-serif'],
        sans: ['"Fredoka"', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Fredoka"', 'system-ui', '-apple-system', 'sans-serif'],
        calligraphy: ['"Ma Shan Zheng"', '"Noto Serif SC"', 'serif'],
      },
      animation: {
        'breathe': 'breathe 6s ease-in-out infinite',
        'subtle-drift': 'subtleDrift 12s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.015)' },
        },
        subtleDrift: {
          '0%': { transform: 'translateY(0px) scale(1)' },
          '100%': { transform: 'translateY(-10px) scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
