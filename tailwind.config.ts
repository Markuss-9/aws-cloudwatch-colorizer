import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        off: {
          DEFAULT: '#530606',
          light: '#5c0707',
          dark: '#430505',
        },
        on: {
          DEFAULT: '#1b5e20',
          light: '#1c6422',
          dark: '#164e1a',
        },
        'rainbow-btn': {
          DEFAULT: '#ffffff00',
          light: '#dbdbdb69',
          dark: '#a5a5a57a',
        },
        surface: {
          DEFAULT: '#363636',
          dark: '#000000',
        },
      },
      fontFamily: {
        cursive: ['cursive'],
      },
      keyframes: {
        'gradient-animation': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'gradient-animation': 'gradient-animation 1s ease both',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
