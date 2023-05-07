import type { Parameters } from "@storybook/react";
import "tailwindcss/tailwind.css";
import "../src/styles/global.css";

export const parameters: Parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
