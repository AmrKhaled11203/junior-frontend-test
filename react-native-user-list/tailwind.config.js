/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        neo: {
          primary: '#134a6d',
          accent: '#fdc800',
          surface: '#fbfbf9',
          black: '#000000',
          text: '#1c293c',
          white: '#ffffff',
          muted: '#666666',
        }
      },
      borderWidth: {
        'neo-thin': '2px',
        'neo-thick': '4px',
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo-md': '4px 4px 0px 0px #000000',
        'neo-lg': '6px 6px 0px 0px #000000',
      }
    },
  },
  plugins: [],
}