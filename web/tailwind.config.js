// @ts-check

import aspectRatioPlugin from "@tailwindcss/aspect-ratio";

/** @type {import("tailwindcss").Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      serif: ["Lora", "ui-serif", "Georgia", "Cambria", "serif"],
    },
  },
  plugins: [aspectRatioPlugin],
};

export default config;
