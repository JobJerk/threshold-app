/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: '#0a0a0a',
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#141414',
        'bg-tertiary': '#1a1a1a',
        card: '#111111',

        // Borders
        'border-default': '#222222',
        'border-hover': '#333333',

        // Text
        'text-primary': '#ffffff',
        'text-secondary': '#a3a3a3',
        'text-tertiary': '#666666',

        // Accent - Amber/Orange
        accent: '#f59e0b',
        'accent-light': '#fbbf24',
        'accent-dark': '#d97706',
        'accent-muted': 'rgba(245, 158, 11, 0.15)',

        // Category colors (muted for dark theme)
        'cat-health': '#ef4444',
        'cat-consumer': '#3b82f6',
        'cat-climate': '#22c55e',
        'cat-tech': '#a855f7',
        'cat-labor': '#f97316',

        // Status
        success: '#22c55e',
        error: '#ef4444',
      },
    },
  },
  plugins: [],
}
