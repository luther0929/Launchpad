/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: "#1F2631",
          800: "#283542",
          600: "#526E8F",
          400: "#7391AB",
        },
        neutral: {
          200: "#D6CCC5",
          100: "#E2E1E0",
        },
      },
    },
  },
  plugins: [],
};
