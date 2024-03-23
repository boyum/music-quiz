import type { StorybookConfig } from "@storybook/nextjs";
import { dirname, join } from "path";

export default {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    "@storybook/addon-styling-webpack",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: true,
  },
} satisfies StorybookConfig;

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}
