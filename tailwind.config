/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  corePlugins: {
    preflight: false, // IMPORTANT: the rest of the app relies on its own hand-written CSS —
    // Tailwind's base reset would strip/override default browser styling that
    // existing components (buttons, inputs, tables, etc.) depend on.
  },
  theme: {
    extend: {
      keyframes: {
        shine: { "100%": { transform: "translateX(150%) skewX(-12deg)" } },
        fadeInUp: { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
      animation: {
        shine: "shine 1.5s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
