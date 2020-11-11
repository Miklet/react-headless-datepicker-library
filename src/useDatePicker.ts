import React from 'react';
import {
  getDaysInMonth,
  addDays,
  format,
  addMonths,
  parse,
  isDate,
  isValid,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { createFocusTrap, FocusTrap } from 'focus-trap';
import { useId } from '@reach/auto-id';
import { range } from './utils';

/**
 * Accessibility practices implemented according to https://w3c.github.io/aria-practices/examples/dialog-modal/datepicker-dialog.html
 */
function useDatePicker() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedDraftDateString, setSelectedDraftDateString] = React.useState<
    string | null
  >(null);
  const [preselectedDate, setPreselectedDate] = React.useState(selectedDate);

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

      weeks[weeks.length - 1].push(
        value === -1
          ? value
          : {
              date: new Date(
                currentPreselectedYear,
                currentPreselectedMonth,
                value
              ),
            }
      );

      return weeks;
    },
    [] as Array<Array<number | { date: Date }>>
  );

  React.useEffect(() => {
    if (isOpen) {
      if (rootRef.current) {
        if (!focusTrapRef.current) {
          focusTrapRef.current = createFocusTrap(rootRef.current, {
            onActivate: () => {
              const currentDateNode =
                daysNodesRefs.current[selectedDate.getDate()];

              if (currentDateNode) {
                currentDateNode.focus();
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
  }, [isOpen, selectedDate]);

  React.useEffect(() => {
    const currentPreselectedDay = daysNodesRefs.current[currentPreselectedDate];

    if (canUpdateFocusedDay.current && currentPreselectedDay) {
      currentPreselectedDay.focus();
    }
  }, [preselectedDate]);

  return {
    isOpen,
    selectedDate,
    preselectedDate,
    weeks: weeksForCurrentMonthView,

    getRootProps() {
      return {
        role: 'dialog' as const,
        ['aria-modal']: true,
        ['aria-labelledby']: 'Choose date',
        ref(node: HTMLElement | null) {
          rootRef.current = node;
        },
      };
    },

    getInputProps() {
      return {
        type: 'text',
        ['aria-label']: 'Date',
        value:
          selectedDraftDateString !== null
            ? selectedDraftDateString
            : format(selectedDate, 'dd/MM/yyyy'),
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
        ['aria-label']: selectedDate
          ? `Change date, selected date is ${selectedDate.toDateString()}`
          : 'Choose date',
        onClick() {
          setIsOpen(prevIsOpen => !prevIsOpen);
        },
      };
    },

    getPrevMonthButtonProps() {
      return {
        ['aria-label']: 'Next month',
        onClick() {
          canUpdateFocusedDay.current = false;
          setPreselectedDate(addMonths(preselectedDate, -1));
        },
      };
    },

    getNextMonthButtonProps() {
      return {
        ['aria-label']: 'Previous month',
        onClick() {
          canUpdateFocusedDay.current = false;
          setPreselectedDate(addMonths(preselectedDate, 1));
        },
      };
    },

    getLiveRegionProps() {
      return {
        id: currentMonthLiveRegionId,
        ['aria-live']: 'polite' as const,
      };
    },

    getGridProps() {
      return {
        role: 'grid' as const,
        ['aria-labelledby']: currentMonthLiveRegionId,
      };
    },

    getDateButtonProps(date: Date) {
      return {
        ['aria-label']: date.toDateString(),
        ref(node: HTMLElement | null) {
          daysNodesRefs.current[date.getDate()] = node;
        },
        tabIndex: date.getDate() === currentPreselectedDate ? 0 : -1,
        onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
          canUpdateFocusedDay.current = true;

          if (event.key === 'ArrowRight') {
            setPreselectedDate(addDays(preselectedDate, 1));
          } else if (event.key === 'ArrowLeft') {
            setPreselectedDate(addDays(preselectedDate, -1));
          } else if (event.key === 'ArrowUp') {
            setPreselectedDate(addDays(preselectedDate, -7));
          } else if (event.key === 'ArrowDown') {
            setPreselectedDate(addDays(preselectedDate, 7));
          } else if (event.key === 'Home') {
            setPreselectedDate(
              startOfWeek(preselectedDate, {
                weekStartsOn: 1,
              })
            );
          } else if (event.key === 'End') {
            setPreselectedDate(
              endOfWeek(preselectedDate, {
                weekStartsOn: 1,
              })
            );
          } else if (event.key === 'PageUp') {
            setPreselectedDate(addMonths(preselectedDate, -1));
          } else if (event.key === 'PageDown') {
            setPreselectedDate(addMonths(preselectedDate, 1));
          } else if (event.key === 'Enter' || event.key === 'Space') {
            event.preventDefault();

            setSelectedDate(preselectedDate);
            setPreselectedDate(preselectedDate);

            if (selectedDraftDateString) {
              setSelectedDraftDateString(null);
            }

            focusTrapRef.current?.deactivate();
          }
        },
        onClick() {
          setSelectedDate(date);
          setPreselectedDate(date);

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
