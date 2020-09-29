import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import WxTable, { WxTableProps } from '../WxTable';
import requestWxApi, { WxRequest } from '@/utils/requestWxApi';
import { Box, Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';

export interface WxTableWithApiProps {
  onWxApi: (filterOptions: FilterOptions) => WxRequest;
  enableDateFilter?: boolean;
  dateFilterLabel?: string;
  enableDateRangeFilter?: boolean;
  dateRangeFilterLabel?: string;
  additionalFilter?: React.ReactNode;
}

interface FilterOptions {
  page: number;
  pageSize: number;
  search?: string;
  date?: Date;
  from?: Date;
  until?: Date;
}

function WxTableWithApi(
  {
    onWxApi,
    options,
    enableDateFilter,
    enableDateRangeFilter,
    dateRangeFilterLabel,
    dateFilterLabel,
    additionalFilter,
    ...restProps
  }: WxTableWithApiProps & Omit<WxTableProps<any>, 'data'>,
  ref,
) {
  const tableRef = useRef(null);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      tableRef.current?.refresh();
    },
  }));

  const [from, setFrom] = useState(null);
  const [until, setUntil] = useState(null);
  const [date, setDate] = useState(null);

  return (
    <WxTable
      externalRef={tableRef}
      {...restProps}
      options={options}
      fetchData={async ({ page, pageSize, search }) => {
        const data = await requestWxApi(
          onWxApi({ page: page + 1, pageSize, search, from, until, date }),
        );
        return {
          data: data.list,
          totalCount: data.total ?? Number.MAX_SAFE_INTEGER,
          page,
        };
      }}
      dateFilter={enableDateFilter ? { onChange: setDate, label: dateFilterLabel } : null}
      dateRangeFilter={
        enableDateRangeFilter
          ? {
              onChange: (value: any[]) => {
                setFrom(value[0]);
                setUntil(value[1]);
              },
              label: dateRangeFilterLabel,
            }
          : null
      }
      additionalFilter={
        <>
          {additionalFilter}{' '}
          <Box ml={2}>
            <Button
              onKeyPress={e => e.key === 'Enter' && tableRef?.current?.refresh()}
              onClick={() => tableRef?.current?.refresh()}
              variant="contained"
              color="primary"
              startIcon={<Search />}
            >
              查询
            </Button>
          </Box>
        </>
      }
    />
  );
}

export default forwardRef(WxTableWithApi);
