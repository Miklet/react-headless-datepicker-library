import React from 'react';
import { Meta } from '@storybook/react';
import { DatePicker } from './DatePicker';
import { addDays, isBefore, isSameDay } from 'date-fns';

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
