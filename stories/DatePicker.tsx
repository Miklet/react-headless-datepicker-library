import React from 'react';
import { useDatePicker } from '../src/useDatePicker';
import {
  Calendar,
  CalendarDay,
  CalendarDayCell,
  CalendarGrid,
  CalendarWeekNameHeader,
  CalendarWeekNamesRow,
  CalendarWeekRow,
  DateInput,
} from './DatePicker.styles';

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

type DatePickerProps = {
  minDate?: Date;
  maxDate?: Date;
};

export function DatePicker(props: DatePickerProps = {}) {
  const {
    isOpen,
    weeks,
    preselectedDate,
    getDateInputProps,
    getOpenButtonProps,
    getRootProps,
    getGridProps,
    getGridItemProps,
    getPrevMonthButtonProps,
    getNextMonthButtonProps,
    getCurrentMonthLiveRegionProps,
    getDayButtonProps,
  } = useDatePicker(props);

  console.log(getPrevMonthButtonProps());

  return (
    <div>
      <div>
        <DateInput {...getDateInputProps()} placeholder="dd/MM/yyyy" />
        <button {...getOpenButtonProps()}>📅</button>
      </div>
      {isOpen ? (
        <Calendar {...getRootProps()}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div {...getCurrentMonthLiveRegionProps()}>
              {MONTHS_OF_YEAR_NAMES[preselectedDate.getMonth()]}{' '}
              {preselectedDate.getFullYear()}
            </div>
            <div>
              <button {...getPrevMonthButtonProps()}>◀</button>
              <button {...getNextMonthButtonProps()}>▶</button>
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
                          {...getGridItemProps()}
                        >
                          <CalendarDay
                            isSelected={day.isSelected}
                            isPreselected={day.isPreselected}
                            isBlocked={day.isBlocked}
                            {...getDayButtonProps(day)}
                          >
                            {day.date.getDate()}
                          </CalendarDay>
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
