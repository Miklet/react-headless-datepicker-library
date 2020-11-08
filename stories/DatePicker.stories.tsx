import React from 'react';
import { Meta, Story } from '@storybook/react';
import { DatePicker } from '../src/DatePicker';

const meta: Meta = {
  title: 'DatePicker',
  component: DatePicker,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = () => <DatePicker />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
