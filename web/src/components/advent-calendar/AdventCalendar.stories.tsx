/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AdventCalendar } from "./AdventCalendar";

// eslint-disable-next-line import/no-default-export
export default {
  title: "Molecules/AdventCalendar",
  component: AdventCalendar,
  args: {},
} as ComponentMeta<typeof AdventCalendar>;

const Template: ComponentStory<typeof AdventCalendar> = args => <AdventCalendar {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
