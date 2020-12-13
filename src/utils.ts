import { isBefore, isAfter, isSameDay } from 'date-fns';

function range(
  length: number,
  mapper: (index: number) => number = index => index
): Array<number> {
  return Array.from({ length }, (_, index) => mapper(index));
}

function isDateOutsideOfRange({
  date,
  minDate,
  maxDate,
}: {
  date: Date;
  minDate?: Date;
  maxDate?: Date;
}): boolean {
  if (minDate && !maxDate) {
    return isBefore(date, minDate) && !isSameDay(date, minDate);
  }

  if (maxDate && !minDate) {
    return isAfter(date, maxDate) && !isSameDay(date, maxDate);
  }

  if (minDate && maxDate) {
    return (
      (isBefore(date, minDate) && !isSameDay(date, minDate)) ||
      (isAfter(date, maxDate) && !isSameDay(date, maxDate))
    );
  }

  return false;
}

export { range, isDateOutsideOfRange };
