/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#f3f0fa',
          card: '#ffffff',
          primary: '#7c3aed', // Purple / Violet
          primaryLight: '#ede9fe',
          primaryDark: '#5b21b6',
          accentCyan: '#06b6d4',
          accentPink: '#f43f5e',
          accentAmber: '#f59e0b',
          accentGreen: '#10b981',
          textDark: '#1e1b4b',
          textMuted: '#64748b',
          border: '#e2e8f0',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(124, 58, 237, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 2px 12px 0 rgba(100, 116, 139, 0.06)',
        'hover': '0 10px 25px -3px rgba(124, 58, 237, 0.12)',
      }
    },
  },
  plugins: [],
}
