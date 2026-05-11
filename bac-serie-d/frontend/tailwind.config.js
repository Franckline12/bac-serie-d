/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#185FA5', light: '#E6F1FB', dark: '#0C447C' },
        purple:  { DEFAULT: '#534AB7', light: '#EEEDFE' },
        success: { DEFAULT: '#3B6D11', light: '#EAF3DE' },
        warning: { DEFAULT: '#BA7517', light: '#FAEEDA' },
        danger:  { DEFAULT: '#993C1D', light: '#FAECE7' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}
