import React, { useState, useCallback } from 'react';
import { Typography, Box, TextField } from '@material-ui/core';
import {
  DatePicker,
  LocalizationProvider,
  DateRangePicker,
  DateRangeDelimiter,
} from '@material-ui/pickers';
import DayjsAdapter from '@material-ui/pickers/adapter/dayjs';
import zhLocale from 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import throttle from 'lodash/throttle';

export interface TitleProps {
  title?: string;
  dateFilter?: { initial?: Date; label?: string; onChange: (value: Date) => void };
  dateRangeFilter?: { initial?: Date[]; label?: string; onChange: (value: Date[]) => void };
  additionalFilter?: React.ReactNode;
}

export default function Title({
  title,
  dateFilter,
  dateRangeFilter,
  additionalFilter,
}: TitleProps) {
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([null, null]);

  const onDateChange = useCallback(
    throttle((date: any) => dateFilter?.onChange?.(date), 1000, {
      leading: false,
      trailing: true,
    }),
    [],
  );

  const onDateRangeChange = useCallback(
    throttle(
      (date: any) =>
        dateRangeFilter?.onChange?.([
          dayjs(date[0]).isValid() ? date[0] : null,
          dayjs(date[1]).isValid() ? date[1] : null,
        ]),
      1000,
      {
        leading: false,
        trailing: true,
      },
    ),
    [],
  );

  return (
    // @ts-ignore
    <LocalizationProvider dateAdapter={DayjsAdapter} locale={zhLocale}>
      <Box display="flex" alignItems="center" overflow="auto">
        <Box mr={2}>
          <Typography color="textPrimary" variant="h4">
            {title}
          </Typography>
        </Box>
        {dateFilter && (
          <Box mr={2}>
            <DatePicker
              label={dateFilter.label || '日期'}
              value={date}
              onChange={date => {
                onDateChange(date);
                setDate(date);
              }}
              inputFormat="yyyy-MM-dd"
              renderInput={props => (
                <TextField
                  {...props}
                  variant="outlined"
                  margin="dense"
                  helperText=""
                  style={Object.assign({}, props.style, { width: 170 })}
                />
              )}
            />
          </Box>
        )}
        {dateRangeFilter && (
          <Box mr={2}>
            <DateRangePicker
              startText="开始日期"
              endText="结束日期"
              // @ts-ignore
              value={dateRange}
              onChange={date => {
                onDateRangeChange(date);
                setDateRange(date);
              }}
              inputFormat="yyyy-MM-dd"
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  {dateRangeFilter.label && (
                    <DateRangeDelimiter> {dateRangeFilter.label} </DateRangeDelimiter>
                  )}
                  <TextField
                    {...startProps}
                    variant="outlined"
                    margin="dense"
                    helperText=""
                    error={false}
                    style={Object.assign({}, startProps.style, { width: 170 })}
                  />
                  <DateRangeDelimiter> 到 </DateRangeDelimiter>
                  <TextField
                    {...endProps}
                    variant="outlined"
                    margin="dense"
                    helperText=""
                    error={false}
                    style={Object.assign({}, endProps.style, { width: 170 })}
                  />
                </React.Fragment>
              )}
            />
          </Box>
        )}
        {additionalFilter && <Box mr={2}>{additionalFilter}</Box>}
      </Box>
    </LocalizationProvider>
  );
}
