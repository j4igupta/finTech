/** @type {import('tailwindcss').Config} */
module.exports = {
  // Added custom color utilities for border and ring
  // These map Tailwind's `border-border` and `border-ring` utilities to CSS variables
  // defined in globals.css, ensuring the @apply statements work without errors.

  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#1E90FF',
        secondary: '#FF69B4',
        accent: '#00FFAA',
        border: 'var(--border)',
        ring: 'var(--border)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],};