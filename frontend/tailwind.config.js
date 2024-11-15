/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        14: "14px",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      backgroundImage: {
        "landing-1": "url('/welcome-to-1.jpg')"
      }
    },
  },
  plugins: [],
  variants: {
    extend: {
      borderWidth: ["hover", "focus"],
    },
  },
};
