// @ts-check

/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  purge: [],
  // purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      serif: ["Lora", "ui-serif", "Georgia", "Cambria", "serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
