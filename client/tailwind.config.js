/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14110F",
        clay: "#8C5E58",
        apricot: "#F4C095",
        sand: "#F7F3EE",
        basil: "#4E6E58"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Trebuchet MS", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 45px rgba(20, 17, 15, 0.12)"
      }
    }
  },
  plugins: []
};
