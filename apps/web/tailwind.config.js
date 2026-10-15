/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3A2117',
          hover: '#542F20',
        },
        accent: {
          DEFAULT: '#C59A5B',
          text: '#8A6428',
        },
        bakery: {
          cream: '#FFF8ED',
          surfaceAlt: '#F2E2D0',
          surface: '#FFFFFF',
          text: '#33241E',
          muted: '#75645A',
          border: '#DFCBB6',
          success: '#148447',
          error: '#B42318',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        cocoa: '0 10px 25px -5px rgba(58, 33, 23, 0.08), 0 8px 10px -6px rgba(58, 33, 23, 0.04)',
        'cocoa-lg': '0 20px 35px -5px rgba(58, 33, 23, 0.12), 0 10px 15px -5px rgba(58, 33, 23, 0.06)',
      },
      borderRadius: {
        '20px': '20px',
      },
    },
  },
  plugins: [],
};
