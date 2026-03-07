/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#162238',
          900: '#0f172a',
          950: '#051026',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#b3c5d9',
          300: '#8ca8c6',
          400: '#6b8bb3',
          500: '#4a6fa0',
          600: '#38528d',
          700: '#2d427a',
          800: '#213267',
          900: '#152154',
        },
      },
      backgroundColor: {
        'dark-grad': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        'dark-card': '#1e293b',
        'dark-input': '#0f172a',
      },
      boxShadow: {
        'dark-sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(59, 130, 246, 0.1)',
        'dark-lg': '0 10px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(59, 130, 246, 0.15)',
        'dark-xl': '0 20px 25px rgba(0, 0, 0, 0.5), 0 10px 10px rgba(59, 130, 246, 0.2)',
        'dark-2xl': '0 25px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(59, 130, 246, 0.1)',
        'neon': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
        'neon-lg': '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}