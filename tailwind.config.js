/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', '15px'],
        'xs': ['13px', '18px'],
        'sm': ['14.5px', '22px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['21px', '30px'],
        '2xl': ['25px', '34px'],
        '3xl': ['32px', '40px'],
      },
      colors: {
        mono: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          850: '#1e1e22',
          900: '#18181b',
          950: '#09090b',
        }
      }
    },
  },
  plugins: [],
}
