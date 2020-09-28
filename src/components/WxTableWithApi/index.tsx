import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import WxTable, { WxTableProps } from '../WxTable';
import requestWxApi, { WxRequest } from '@/utils/requestWxApi';

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

  useEffect(() => {
    tableRef.current?.refresh();
  }, [from, until]);

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
          page: data.currentPage - 1,
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
      additionalFilter={additionalFilter}
    />
  );
}

export default forwardRef(WxTableWithApi);
