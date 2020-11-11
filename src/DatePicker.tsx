import React from 'react';

import {
  CalendarWeekNamesRow,
  CalendarWeekNameHeader,
  CalendarWeekRow,
  CalendarDayCell,
  Calendar,
  CalendarGrid,
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
    getInputProps,
    getOpenButtonProps,
    getRootProps,
    getGridProps,
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
        <Calendar {...getRootProps()}>
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
          <CalendarGrid {...getGridProps()}>
            <thead>
              <CalendarWeekNamesRow>
                {DAYS_OF_WEEK_NAMES.map(dayOfWeekName => {
                  return (
                    <CalendarWeekNameHeader
                      key={dayOfWeekName}
                      scope="col"
                      abbr={dayOfWeekName}
                    >
                      {dayOfWeekName.substr(0, 2)}
                    </CalendarWeekNameHeader>
                  );
                })}
              </CalendarWeekNamesRow>
            </thead>
            <tbody>
              {weeks.map((week, weekIndex) => {
                return (
                  <CalendarWeekRow key={weekIndex}>
                    {week.map((day, index) => {
                      return day === null ? (
                        <CalendarDayCell key={index} />
                      ) : (
                        <CalendarDayCell
                          key={day.date.getTime()}
                          isSelected={day.isSelected}
                          isPreselected={day.isPreselected}
                          {...getDateButtonProps(day.date)}
                        >
                          {day.date.getDate()}
                        </CalendarDayCell>
                      );
                    })}
                  </CalendarWeekRow>
                );
              })}
            </tbody>
          </CalendarGrid>
        </Calendar>
      ) : null}
    </div>
  );
}
