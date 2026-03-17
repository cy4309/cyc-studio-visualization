/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2d80e9", // 藍色
        background: "#0c0c0c", // 深黑色
        foreground: "#f2f2f2", // 淺白色
        accent: "#d9d5cd", // 灰色
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
