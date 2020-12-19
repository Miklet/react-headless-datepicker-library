import {
  Box,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  Popover,
  TextField,
  Typography,
} from '@material-ui/core';
import { CalendarToday, ChevronLeft, ChevronRight } from '@material-ui/icons';
import * as React from 'react';
import { useRef } from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import { useDatePicker } from '../../src';

const DAYS_OF_WEEK_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const MONTHS_OF_YEAR_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'October',
  'September',
  'November',
  'December',
];

const useStyles = makeStyles({
  root: {
    maxWidth: 325,
    minWidth: 310,
    minHeight: 305,
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  weeks: {
    marginTop: 12,
  },
  day: {
    width: 36,
    height: 36,
    '&:focus': {
      color: '#fff',
      backgroundColor: '#1976d2',
    },
  },
  daySelected: {},
});

const App = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const styles = useStyles();

  const {
    isOpen,
    preselectedDate,
    weeks,
    getRootProps,
    getOpenButtonProps,
    getCurrentMonthLiveRegionProps,
    getDateInputProps,
    getDayButtonProps,
    getGridItemProps,
    getGridProps,
    getNextMonthButtonProps,
    getPrevMonthButtonProps,
  } = useDatePicker();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <TextField
        label="Date"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton {...getOpenButtonProps()}>
                <CalendarToday />
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={getDateInputProps()}
        inputRef={inputRef}
      />
      <Popover
        open={isOpen}
        anchorEl={inputRef.current}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        BackdropProps={{
          invisible: true,
        }}
        role="application"
      >
        <Paper className={styles.root} {...getRootProps()}>
          <div className={styles.navigation}>
            <IconButton disableFocusRipple {...getPrevMonthButtonProps()}>
              <ChevronLeft />
            </IconButton>
            <div {...getCurrentMonthLiveRegionProps()}>
              <Typography>
                {MONTHS_OF_YEAR_NAMES[preselectedDate.getMonth()]}{' '}
                {preselectedDate.getFullYear()}
              </Typography>
            </div>
            <IconButton {...getNextMonthButtonProps()}>
              <ChevronRight />
            </IconButton>
          </div>
          <Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              {DAYS_OF_WEEK_NAMES.map(dayOfWeek => (
                <Box
                  key={dayOfWeek}
                  width={36}
                  marginX="2px"
                  textAlign="center"
                >
                  <Typography variant="caption">
                    {dayOfWeek.substring(0, 2)}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box display="flex" justifyContent="center">
              <Box {...getGridProps()}>
                {weeks.map((week, index) => (
                  <Box key={index} display="flex">
                    {week.map((day, dayIndex) => (
                      <Box
                        key={dayIndex}
                        width={36}
                        height={36}
                        marginX="2px"
                        {...getGridItemProps()}
                      >
                        {day ? (
                          <IconButton
                            {...getDayButtonProps(day)}
                            size="small"
                            disableRipple
                            className={`${styles.day} ${day.isPreselected &&
                              styles.daySelected}`}
                          >
                            <Typography variant="body2">
                              {day.date.getDate()}
                            </Typography>
                          </IconButton>
                        ) : (
                          ''
                        )}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Popover>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
