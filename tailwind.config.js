/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        'urban': ["urbane-rounded", "sans-serif"],
        'roboto': ["roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
  darkMode: "media",
};
