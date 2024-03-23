import { Meta, StoryObj } from "@storybook/react";
import { AdventCalendar } from "./AdventCalendar";

export default {
  title: "Molecules/AdventCalendar",
  component: AdventCalendar,
  args: {},
} satisfies Meta<typeof AdventCalendar>;

type Story = StoryObj<typeof AdventCalendar>;

export const Primary: Story = {
  args: {
    finishedDays: [1, 2, 3, 4],
    month: 11,
    date: new Date("2000-12-16").getTime(),
  },
};
