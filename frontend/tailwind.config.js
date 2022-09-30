/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        downup: {
          '0%': { transform: 'translateY(40px)' },
          '10%': { transform: 'translateY(80px)' },
          '30%': { transform: 'translateY(100px)' },
          '40%': { transform: 'translateY(80px)' },
          '50%': { transform: 'translateY(100px)' },
          '60%': { transform: 'translateY(80px)' },
          '70%': { transform: 'translateY(60px)' },
          '80%': { transform: 'translateY(40px)' },
          '90%': { transform: 'translateY(20px)' },
          '100%': { transform: 'translateY(0px)' },
        },
      },
      animation: {
        'downup': 'downup 1.5s ease-out infinite',
      },
    },
  },
  plugins: [require("daisyui")],
}
