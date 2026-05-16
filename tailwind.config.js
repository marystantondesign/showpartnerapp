/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        greige: '#F5F2EE',
        'greige-dark': '#1A1816',
        'off-white': '#F0EDE8',
        divider: '#E0DDD8',
        'divider-dark': '#2E2B28',
        'text-main': '#111111',
        'text-muted': '#888580',
        amber: '#D4A853',
        slate: '#8A9BB0',
        terracotta: '#C4614A',
        sage: '#7A9E7E',
        'not-started': '#E8E4DF',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
