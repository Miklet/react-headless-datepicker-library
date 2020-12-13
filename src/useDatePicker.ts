import { useId } from '@reach/auto-id';
import {
  addDays,
  addMonths,
  endOfWeek,
  format,
  getDaysInMonth,
  isDate,
  isSameDay,
  isValid,
  lastDayOfMonth,
  parse,
  setDate,
  startOfWeek,
} from 'date-fns';
import { createFocusTrap, FocusTrap } from 'focus-trap';
import React from 'react';
import { isDateOutsideOfRange, range } from './utils';

type CalendarDay = {
  date: Date;
  isSelected: boolean;
  isPreselected: boolean;
  isBlocked: boolean;
};

type Props = {
  minDate?: Date;
  maxDate?: Date;
};

/**
 * Accessibility practices implemented according to https://w3c.github.io/aria-practices/examples/dialog-modal/datepicker-dialog.html
 */
function useDatePicker({ minDate, maxDate }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedDraftDateString, setSelectedDraftDateString] = React.useState<
    string | null
  >(null);
  const [preselectedDate, setPreselectedDate] = React.useState(new Date());

  const rootRef = React.useRef<HTMLElement | null>(null);
  const openButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const focusTrapRef = React.useRef<FocusTrap | null>(null);
  const daysNodesRefs = React.useRef<Array<HTMLElement | null>>([]);
  const canUpdateFocusedDay = React.useRef(true);

  const currentMonthLiveRegionId = useId();

  const currentPreselectedDate = preselectedDate.getDate();
  const currentPreselectedMonth = preselectedDate.getMonth();
  const currentPreselectedYear = preselectedDate.getFullYear();

  const daysInMonth = getDaysInMonth(preselectedDate);

  const firstDayOfWeekForCurrentMonthView = new Date(
    currentPreselectedYear,
    currentPreselectedMonth,
    0
  ).getDay();

  const daysForCurrentMonthView = [
    ...range(firstDayOfWeekForCurrentMonthView, () => -1),
    ...range(daysInMonth, index => index + 1),
  ];

  const weeksForCurrentMonthView = daysForCurrentMonthView.reduce(
    (weeks, value, index) => {
      if (index % 7 === 0) {
        weeks.push([]);
      }

      const currentDateOfWeek = new Date(
        currentPreselectedYear,
        currentPreselectedMonth,
        value
      );

      weeks[weeks.length - 1].push(
        value === -1
          ? null
          : {
              date: currentDateOfWeek,
              isSelected:
                selectedDate !== null
                  ? isSameDay(currentDateOfWeek, selectedDate)
                  : false,
              isPreselected: isSameDay(currentDateOfWeek, preselectedDate),
              isBlocked: isDateOutsideOfRange({
                date: currentDateOfWeek,
                minDate,
                maxDate,
              }),
            }
      );

      return weeks;
    },
    [] as Array<Array<null | CalendarDay>>
  );

  React.useEffect(() => {
    if (isOpen) {
      if (rootRef.current) {
        if (!focusTrapRef.current) {
          focusTrapRef.current = createFocusTrap(rootRef.current, {
            onActivate: () => {
              const dateToFocus = selectedDate
                ? selectedDate.getDate()
                : preselectedDate.getDate();

              const dateToFocusNode = daysNodesRefs.current[dateToFocus];

              if (dateToFocusNode) {
                dateToFocusNode.focus();
              }
            },
            onDeactivate: () => {
              setIsOpen(false);
              window.setTimeout(() => openButtonRef.current?.focus(), 0);
            },
            clickOutsideDeactivates: true,
          });

          focusTrapRef.current.activate();
        }
      }
    } else {
      focusTrapRef.current?.deactivate();
    }

    return () => {
      if (!isOpen) {
        focusTrapRef.current?.deactivate();
      }

      focusTrapRef.current = null;
    };
  }, [isOpen, selectedDate, preselectedDate]);

  React.useEffect(() => {
    const currentPreselectedDay = daysNodesRefs.current[currentPreselectedDate];

    if (canUpdateFocusedDay.current && currentPreselectedDay) {
      currentPreselectedDay.focus();
    }
  }, [currentPreselectedDate]);

  function internalSetSelectedDate(date: Date) {
    if (isDateOutsideOfRange({ date, minDate, maxDate })) {
      return;
    }

    setSelectedDate(date);
  }

  function internalSetPreselectedDate(date: Date) {
    if (isDateOutsideOfRange({ date, minDate, maxDate })) {
      return;
    }

    setPreselectedDate(date);
  }

  return {
    isOpen,
    selectedDate,
    preselectedDate,
    weeks: weeksForCurrentMonthView,

    getRootProps() {
      return {
        role: 'dialog' as const,
        'aria-modal': true,
        'aria-labelledby': 'Choose date',
        ref(node: HTMLElement | null) {
          rootRef.current = node;
        },
      };
    },

    getDateInputProps() {
      return {
        type: 'text',
        'aria-label': 'Date',
        value:
          selectedDraftDateString !== null
            ? selectedDraftDateString
            : selectedDate
            ? format(selectedDate, 'dd/MM/yyyy')
            : '',
        onBlur() {
          if (selectedDraftDateString !== null) {
            const parsedDate = parse(
              selectedDraftDateString,
              'dd/MM/yyyy',
              new Date()
            );

            if (isValid(parsedDate)) {
              setSelectedDate(parsedDate);
              setPreselectedDate(parsedDate);
              setSelectedDraftDateString(null);
            } else {
              const fallbackParsedDate = new Date(selectedDraftDateString);

              if (isValid(fallbackParsedDate)) {
                setSelectedDate(fallbackParsedDate);
                setPreselectedDate(fallbackParsedDate);
                setSelectedDraftDateString(null);
              } else {
                setSelectedDate(new Date());
                setPreselectedDate(new Date());
                setSelectedDraftDateString(null);
              }
            }
          }
        },
        onChange(event: React.ChangeEvent<HTMLInputElement>) {
          setSelectedDraftDateString(event.target.value);

          try {
            const parsedDate = parse(
              event.target.value,
              'dd/MM/yyyy',
              new Date()
            );

            if (isDate(parsedDate)) {
              setSelectedDate(parsedDate);
            }
          } catch {}
        },
      };
    },

    getOpenButtonProps() {
      return {
        ref: openButtonRef,
        'aria-label': selectedDate
          ? `Change date, selected date is ${format(
              selectedDate,
              'dd/MM/yyyy'
            )}`
          : 'Choose date',
        onClick() {
          setIsOpen(prevIsOpen => !prevIsOpen);
        },
      };
    },

    getPrevMonthButtonProps() {
      return {
        disabled: isDateOutsideOfRange({
          date: lastDayOfMonth(addMonths(preselectedDate, -1)),
          minDate,
          maxDate,
        }),
        'aria-label': 'Previous month',
        onClick() {
          canUpdateFocusedDay.current = false;
          setPreselectedDate(addMonths(preselectedDate, -1));
        },
      };
    },

    getNextMonthButtonProps() {
      return {
        disabled: isDateOutsideOfRange({
          date: setDate(addMonths(preselectedDate, 1), 1),
          minDate,
          maxDate,
        }),
        'aria-label': 'Next month',
        onClick() {
          canUpdateFocusedDay.current = false;
          setPreselectedDate(addMonths(preselectedDate, 1));
        },
      };
    },

    getCurrentMonthLiveRegionProps() {
      return {
        id: currentMonthLiveRegionId,
        'aria-live': 'polite' as const,
      };
    },

    getGridProps() {
      return {
        role: 'grid',
        'aria-labelledby': currentMonthLiveRegionId,
      };
    },

    getGridItemProps() {
      return {
        role: 'gridcell',
      };
    },

    getDayButtonProps(day: CalendarDay) {
      return {
        'aria-label': day.date.toDateString(),
        ref(node: HTMLElement | null) {
          daysNodesRefs.current[day.date.getDate()] = node;
        },
        tabIndex:
          !day.isBlocked && day.date.getDate() === currentPreselectedDate
            ? 0
            : -1,
        disabled: day.isBlocked,
        onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
          canUpdateFocusedDay.current = true;

          if (event.key === 'ArrowRight') {
            internalSetPreselectedDate(addDays(preselectedDate, 1));
          } else if (event.key === 'ArrowLeft') {
            internalSetPreselectedDate(addDays(preselectedDate, -1));
          } else if (event.key === 'ArrowUp') {
            internalSetPreselectedDate(addDays(preselectedDate, -7));
          } else if (event.key === 'ArrowDown') {
            internalSetPreselectedDate(addDays(preselectedDate, 7));
          } else if (event.key === 'Home') {
            internalSetPreselectedDate(
              startOfWeek(preselectedDate, {
                weekStartsOn: 1,
              })
            );
          } else if (event.key === 'End') {
            internalSetPreselectedDate(
              endOfWeek(preselectedDate, {
                weekStartsOn: 1,
              })
            );
          } else if (event.key === 'PageUp') {
            internalSetPreselectedDate(addMonths(preselectedDate, -1));
          } else if (event.key === 'PageDown') {
            internalSetPreselectedDate(addMonths(preselectedDate, 1));
          } else if (event.key === 'Enter' || event.key === 'Space') {
            event.preventDefault();

            internalSetSelectedDate(preselectedDate);
            internalSetPreselectedDate(preselectedDate);

            if (selectedDraftDateString) {
              setSelectedDraftDateString(null);
            }

            focusTrapRef.current?.deactivate();
          }
        },
        onClick() {
          internalSetSelectedDate(day.date);
          internalSetPreselectedDate(day.date);

          if (selectedDraftDateString) {
            setSelectedDraftDateString(null);
          }

          focusTrapRef.current?.deactivate();
        },
      };
    },
  };
}

export { useDatePicker };
