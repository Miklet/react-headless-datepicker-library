import React from 'react';

import {
  WeekHeadRow,
  WeekHeadCell,
  WeekBodyRow,
  WeekBodyCell,
} from './DatePicker.styles';

import { useDatePicker } from './useDatePicker';

const DAYS_OF_WEEK_NAMES = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const MONTHS_OF_YEAR_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'october',
  'september',
  'november',
  'december',
];

export function DatePicker() {
  const {
    isOpen,
    weeks,
    preselectedDate,
    getRootProps,
    getInputProps,
    getOpenButtonProps,
    getPrevMonthButtonProps,
    getNextMonthButtonProps,
    getLiveRegionProps,
    getDateButtonProps,
  } = useDatePicker();

  const openButtonProps = getOpenButtonProps();

  return (
    <div>
      <div>
        <input {...getInputProps()} />
        <button {...openButtonProps}>📅</button>
      </div>
      {isOpen ? (
        <div {...getRootProps()} style={{ position: 'absolute' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div {...getLiveRegionProps()}>
              {MONTHS_OF_YEAR_NAMES[preselectedDate.getMonth()]}{' '}
              {preselectedDate.getFullYear()}
            </div>
            <div>
              <button {...getNextMonthButtonProps()}>⬆</button>
              <button {...getPrevMonthButtonProps()}>⬇</button>
            </div>
          </div>
          <table role="grid">
            <thead>
              <WeekHeadRow>
                {DAYS_OF_WEEK_NAMES.map(dayOfWeekName => {
                  return (
                    <WeekHeadCell
                      key={dayOfWeekName}
                      scope="col"
                      abbr={dayOfWeekName}
                    >
                      {dayOfWeekName.substr(0, 2)}
                    </WeekHeadCell>
                  );
                })}
              </WeekHeadRow>
            </thead>
            <tbody>
              {weeks.map((week, weekIndex) => {
                return (
                  <WeekBodyRow key={weekIndex}>
                    {week.map((day, index) => {
                      return typeof day === 'number' ? (
                        <WeekBodyCell key={index} />
                      ) : (
                        <WeekBodyCell
                          key={index}
                          {...getDateButtonProps(day.date)}
                        >
                          {day.date.getDate()}
                        </WeekBodyCell>
                      );
                    })}
                  </WeekBodyRow>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
