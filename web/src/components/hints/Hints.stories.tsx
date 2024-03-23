import { Meta, StoryObj } from "@storybook/react";
import { Hints } from "./Hints";

export default {
  title: "Molecules/Hints",
  component: Hints,
  args: {
    hints: [
      "Hint number 1",
      "See there, told you that would be easy. We'll paint one happy little tree right here. Don't kill all your dark areas - you need them to show the light.",
      "Let's have a nice tree right here. It just happens - whether or not you worried about it or tried to plan it.",
    ],
  },
} satisfies Meta<typeof Hints>;

type Story = StoryObj<typeof Hints>;

export const Primary: Story = {
  args: {},
};
