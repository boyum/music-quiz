// @ts-check

/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      serif: ["Lora", "ui-serif", "Georgia", "Cambria", "serif"],
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
