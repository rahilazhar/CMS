/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      animation : {
        'blink': 'blink 1s linear infinite',
        'color-change': 'color-change 3s linear infinite',
      },
      colors:{
        'light-white' : ' rgba(255,255,255,0.18)'
      }
    },
  },
  darkMode: "class",
  plugins: [require("tw-elements/dist/plugin.cjs")]
}

