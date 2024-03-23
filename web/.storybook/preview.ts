import type { Parameters } from "@storybook/react";
import "../src/styles/global.css";

export const parameters: Parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
