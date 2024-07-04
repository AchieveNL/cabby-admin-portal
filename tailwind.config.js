/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-light-4': '#FFFFFF',
        'neutral-10': '#f4f4f4',
        'success-light-2': '#dcffd6',
        'success-dark-1': '#188006',
        'neutral-white': '#fff',
        'neutral-75': '#575757',
        'danger-light-2': '#ffd4d4',
        'primary-light-1': '#7b8ef0',
        'body-text-body-color': '#212529',
        'primary-base': '#2d46c4',
        'nine66-cyan': '#6ce3b8',
        'nine66-blue-100': '#1b61f6',
        'primary-light-3': '#f2f4ff',
        'primary-light-2': '#e8ebff',
        'danger-base': '#d92037',
        'success-base': '#5bbc4b',
        'neutral-100': '#0a0a1c',
        'primary-dark-1': '#1f3086',
        'gray-300': '#dee2e6',
        hitbox: 'rgba(255, 255, 255, 0)',
        'neutral-50': '#8d8d8d',
      },
      borderRadius: {
        '32xl': '3.1875rem',
        '19xl': '2.375rem',
        '28xl': '2.9375rem',
      },
      fontFamily: {
        sans: ['THICCCBOI', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        1: '4px 4px 29px 0px rgba(221, 237, 251, 0.30)',
      },
    },
  },
  // plugins: [
  //   require("@tailwindcss/forms"),
  //   require("@tailwindcss/aspect-ratio"),
  //   require("@tailwindcss/line-clamp"),
  // ],
};
