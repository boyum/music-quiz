/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CalendarDay } from "./CalendarDay";

// eslint-disable-next-line import/no-default-export
export default {
  title: "Atoms/CalendarDay",
  component: CalendarDay,
  args: {},
} as ComponentMeta<typeof CalendarDay>;

const Template: ComponentStory<typeof CalendarDay> = args => <CalendarDay {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
