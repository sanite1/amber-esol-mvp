/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // only src folder matters for CRA
  ],
  theme: {
    extend: {
      keyframes: {
        spinIn: {
          "0%": { opacity: "0", transform: "rotate(-180deg) scale(0.5)" },
          "100%": { opacity: "1", transform: "rotate(0deg) scale(1)" },
        },
        spinOut: {
          "0%": { opacity: "1", transform: "rotate(0deg) scale(1)" },
          "100%": { opacity: "0", transform: "rotate(180deg) scale(0.5)" },
        },
      },
      animation: {
        spinIn: "spinIn 0.6s ease-out forwards",
        spinOut: "spinOut 0.6s ease-in forwards",
      },
    },
  },
  plugins: [],
};
