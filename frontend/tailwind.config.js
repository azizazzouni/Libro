/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f7f6f3',
          100: '#eeece6',
          200: '#dbd8ce',
          300: '#c2bdb0',
          400: '#a69d8d',
          500: '#918167',
          600: '#7a6b55',
          700: '#655847',
          800: '#544a3d',
          900: '#473f35',
          950: '#262018',
        },
        cream: '#faf9f6',
        parchment: '#f0ede6',
        gold: '#c9a84c',
        'gold-light': '#e8d5a3',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
