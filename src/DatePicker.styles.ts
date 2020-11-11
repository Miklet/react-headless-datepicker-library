import styled, { css } from 'styled-components';

export const Calendar = styled.div`
  position: absolute;
`;

export const CalendarGrid = styled.table``;

export const CalendarWeekNamesRow = styled.tr``;

export const CalendarWeekNameHeader = styled.th``;

export const CalendarWeekRow = styled.tr``;

type CalendarDayCellProps = {
  isSelected?: boolean;
  isPreselected?: boolean;
};

export const CalendarDayCell = styled.td<CalendarDayCellProps>`
  padding: 8px;
  width: 32px;
  height: 32px;
  text-align: center;
  box-sizing: border-box;
  border-radius: 50%;

  ${({ isSelected }) =>
    isSelected &&
    css`
      font-weight: 600;
      color: blue;
    `}

  ${({ isPreselected }) =>
    isPreselected &&
    css`
      background-color: lightblue;
    `}
`;
