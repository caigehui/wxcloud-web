import React, { useState, useEffect, useRef } from 'react';
import WxTable, { WxTableProps } from '../WxTable';
import requestWxApi, { WxRequest } from '@/utils/requestWxApi';

export interface WxTableWithApiProps {
  onWxApi: (filterOptions: FilterOptions) => WxRequest;
  deps?: Array<any>;
  enableDateFilter?: boolean;
  enableDateRangeFilter?: boolean;
  additionalFilter?: React.ReactNode;
}

interface FilterOptions {
  page: number;
  pageSize: number;
  date?: Date;
  from?: Date;
  until?: Date;
}

function WxTableWithApi({
  onWxApi,
  options,
  deps,
  enableDateFilter,
  enableDateRangeFilter,
  additionalFilter,
  ...restProps
}: WxTableWithApiProps & Omit<WxTableProps<any>, 'data'>) {
  const ref = useRef(null);
  const [from, setFrom] = useState(null);
  const [until, setUntil] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    ref.current?.refresh();
  }, [from, until].concat(deps));

  return (
    <WxTable
      externalRef={ref}
      {...restProps}
      options={options}
      fetchData={async ({ page, pageSize }) => {
        const data = await requestWxApi(onWxApi({ page: page + 1, pageSize, from, until, date }));
        return {
          data: data.list,
          totalCount: data.total ?? Number.MAX_SAFE_INTEGER,
          page: data.currentPage - 1,
        };
      }}
      dateFilter={enableDateFilter ? { onChange: setDate } : null}
      dateRangeFilter={
        enableDateRangeFilter
          ? {
              onChange: (value: any[]) => {
                setFrom(value[0]);
                setUntil(value[1]);
              },
            }
          : null
      }
      additionalFilter={additionalFilter}
    />
  );
}

export default WxTableWithApi;
