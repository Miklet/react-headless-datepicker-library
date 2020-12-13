import styled, { css } from 'styled-components';

export const DateInput = styled.input`
  font-size: 1rem;
  padding: 8px;
`;

export const Calendar = styled.div`
  position: absolute;
  padding: 24px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  font-family: 'Verdana', sans-serif;
`;

export const CalendarGrid = styled.table``;

export const CalendarWeekNamesRow = styled.tr``;

export const CalendarWeekNameHeader = styled.th`
  font-size: 0.75rem;
  text-transform: uppercase;
`;

export const CalendarWeekRow = styled.tr``;

export const CalendarDayCell = styled.td``;

type CalendarDayProps = {
  isSelected?: boolean;
  isPreselected?: boolean;
  isBlocked?: boolean;
};

export const CalendarDay = styled.button<CalendarDayProps>`
  padding: 8px;
  margin: 0;
  border: 0;
  width: 32px;
  height: 32px;
  text-align: center;
  box-sizing: border-box;

  background: transparent;
  border-radius: 50%;

  font-family: 'Verdana', sans-serif;

  ${({ isSelected }) =>
    isSelected &&
    css`
      font-weight: 700;
    `}

  ${({ isPreselected }) =>
    isPreselected &&
    css`
      background-color: lightblue;
    `}

  ${({ isBlocked }) =>
    isBlocked &&
    css`
      background-color: lightgray;
    `}
`;
