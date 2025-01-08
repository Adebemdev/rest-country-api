/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-element': 'hsl(209, 23%, 22%)',
        'dark-blue-bg': ' hsl(207, 26%, 17%)',
        'very-dark-blue-bg': 'hsl(200, 15%, 8%)',
        'dark-gray': 'hsl(0, 0%, 52%)',
        'very-light-gray': 'hsl(0, 0%, 98%)',
        White: 'hsl(0, 0%, 100%)',
      },
    },
  },
  plugins: [],
};
