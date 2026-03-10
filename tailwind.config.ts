import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#0B2416',
          hover:   '#143320',
          active:  '#1C4229',
          border:  '#1A3D25',
          text:    '#8FC4A2',
          muted:   '#4A7A5C',
        },
        primary: {
          50:  '#EDFAF5',
          100: '#D0F4E6',
          200: '#A3E9CE',
          300: '#6DD9B5',
          400: '#3DC99C',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-md': '0 4px 12px 0 rgb(0 0 0 / 0.08)',
      },
    }
  }
} satisfies Config;
