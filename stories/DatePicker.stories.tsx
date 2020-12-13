import { Meta } from '@storybook/react';
import { addDays } from 'date-fns';
import React from 'react';
import { DatePicker } from './DatePicker';

const meta: Meta = {
  title: 'DatePicker',
  component: DatePicker,
  argTypes: {},
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

export const Default = () => <DatePicker />;

export const MinAndMax = () => (
  <DatePicker
    minDate={addDays(new Date(), -14)}
    maxDate={addDays(new Date(), 14)}
  />
);

Default.args = {};
