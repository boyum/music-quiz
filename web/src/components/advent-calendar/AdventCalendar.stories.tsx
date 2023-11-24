/* eslint-disable react/jsx-props-no-spreading */
import { Meta, StoryFn } from "@storybook/react";
import { AdventCalendar } from "./AdventCalendar";

export default {
  title: "Molecules/AdventCalendar",
  component: AdventCalendar,
  args: {},
} satisfies Meta<typeof AdventCalendar>;

const Template: StoryFn<typeof AdventCalendar> = args => (
  <AdventCalendar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  finishedDays: [1, 2, 3, 4],
  month: 11,
  date: new Date("2000-12-16").getTime(),
};
