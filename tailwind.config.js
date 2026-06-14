/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // only src folder matters for CRA
  ],
  theme: {
    extend: {
      // Amber ESOL brand tokens — mirror the CSS variables in
      // src/styles/amber-design-system.css so Tailwind utilities
      // (e.g. bg-amber-navy, text-amber-orange) can be used
      // alongside the design-system component classes.
      colors: {
        amber: {
          navy: "#0B2343",
          "navy-deep": "#06182f",
          "navy-1a": "#122b52",
          orange: "#ff7c22",
          "orange-deep": "#e8651a",
          green: "#22a06b",
          red: "#d32f2f",
          bg: "#faf8f3",
          "bg-soft": "#f3eee3",
          cream: "#fff8ee",
          "on-navy": "#f0ead9",
        },
      },
      borderRadius: {
        "amber-sm": "8px",
        "amber-md": "14px",
        "amber-lg": "20px",
        "amber-xl": "28px",
        "amber-pill": "999px",
      },
      boxShadow: {
        "amber-soft": "0 24px 60px -28px rgba(11, 35, 67, 0.22)",
        "amber-lift": "0 8px 28px -14px rgba(11, 35, 67, 0.18)",
      },
      fontFamily: {
        "amber-sans": [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"Inter"',
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        "amber-mono": [
          "ui-monospace",
          '"SF Mono"',
          '"JetBrains Mono"',
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      maxWidth: {
        "amber-container": "1240px",
      },
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
