import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import MaterialTable, {
  MaterialTableProps,
  Options,
  Action,
  Column,
  Query,
  QueryResult,
} from 'material-table';
import tableIcons from './tableIcons';
import { Paper, makeStyles } from '@material-ui/core';
import { useMount } from 'ahooks';
import mapColumns from './columns';
import mapActions, { Insertable, Deletable, Sortable } from './actions';
import mapEditable from './editable';
import defaultLocalization from './localization';
import Title, { TitleProps } from './title';
import components from './components';

interface TableProps<T extends Object> extends Omit<MaterialTableProps<T>, 'data'> {
  /**
   * 如果要使用静态数据，则传递data
   */
  data?: Array<T>;
  /**
   * 如果要使用远程动态数据，传递一个Promise函数
   */
  fetchData?: (query: Query<T>) => Promise<QueryResult<T>>;
  /**
   * 是否可以允许新增和插入
   */
  insertable?: Insertable<T>;
  /**
   * 是否允许上下移动
   */
  sortable?: Sortable<T>;
  /**
   * 是否允许删除
   */
  deletable?: Deletable<T>;
  /**
   * 暴露给外部的Ref
   */
  externalRef?: React.Ref<any>;
  /**
   * MaterialTable options
   */
  options?: Options<T>;
  /**
   * MaterialTable Column
   */
  columns: Array<Column<T>>;
  /**
   * 最低高度
   */
  minHeight?: number;
  /**
   * 额外操作 MaterialTable Action
   */
  actions?: (Action<T> | ((rowData: T) => Action<T>))[];
  /**
   * 是否只读，隐藏一切操作
   */
  readonly?: boolean;
}

export type WxTableProps<T extends Object> = TableProps<T> & TitleProps;

const defaultMinHeight = 300;
const toolbarHeight = 64;
const footerHeight = 52;
const groupingHeight = 53;

export const defaultWxTableOptions: Options<any> = {
  toolbar: true,
  paging: true,
  draggable: false,
  grouping: false,
  filtering: false,
  pageSize: 10,
  pageSizeOptions: [5, 10, 20, 30],
  thirdSortClick: false,
  showEmptyDataSourceMessage: false,
  actionsCellStyle: { margin: '0 auto', textAlign: 'center' },
};

const useStyles = makeStyles({
  wxTableContainer: {
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    marginBottom: -1,
  },
});

const WxTable = <RowData extends object>({
  options,
  title,
  minHeight = defaultMinHeight,
  fetchData,
  data,
  insertable,
  deletable,
  actions,
  readonly,
  sortable,
  columns,
  additionalFilter,
  dateFilter,
  dateRangeFilter,
  externalRef,
  localization,
  ...restProps
}: WxTableProps<RowData>) => {
  const styles = useStyles();
  const ref = useRef<HTMLDivElement>(null);
  const tableRef = useRef<MaterialTable<RowData>>(null);

  useImperativeHandle(externalRef, () => ({
    refresh: () => {
      tableRef.current?.['onQueryChange']();
    },
  }));

  const [myData, setMyData] = useState<Array<RowData>>(data || []);
  const [loading, setLoading] = useState(false);

  // 如果data发生变化，重新赋值myData
  useEffect(() => Array.isArray(data) && setMyData(data as Array<RowData>), [data]);
  // myData发生变化
  useEffect(() => {
    // 新增或者插入一条的情况
    if (myData?.some((i: any) => i['tableData'].isNew)) {
      // 新增后立即进入编辑状态
      onEditRow(
        null,
        myData.find((i: any) => i['tableData'].isNew),
      );
    }
  }, [myData]);

  // 自适应高度
  const [tableBodyHeight, setTableBodyHeight] = useState(0);
  const myOptions = Object.assign({}, defaultWxTableOptions, options, {
    maxBodyHeight: tableBodyHeight,
    minBodyHeight: tableBodyHeight,
  });
  useMount(() => {
    setTimeout(() => {
      const totalHeight = ref?.current?.clientHeight || window.innerHeight;
      setTableBodyHeight(
        Math.max(
          minHeight,
          totalHeight -
            (myOptions.toolbar ? toolbarHeight : 0) -
            (myOptions.paging ? footerHeight : 0) -
            (myOptions.grouping ? groupingHeight : 0),
        ),
      );
    }, 1);
  });

  // 编辑行
  const onEditRow = (event, rowData) => {
    tableRef?.current?.['dataManager'].changeRowEditing(rowData, 'update');
    tableRef?.current?.setState({
      ...tableRef?.current['dataManager'].getRenderState(),
      showAddRow: false,
    });
  };

  return (
    <Paper ref={ref} className={styles.wxTableContainer}>
      <MaterialTable
        {...restProps}
        isLoading={loading || restProps.isLoading}
        tableRef={tableRef}
        data={fetchData || myData}
        options={myOptions}
        columns={mapColumns(columns)}
        actions={mapActions({
          myData,
          setMyData,
          onEditRow,
          insertable,
          deletable,
          sortable,
          readonly,
          actions,
          setLoading,
        })}
        editable={mapEditable({ insertable, readonly, myData, columns })}
        localization={Object.assign({}, defaultLocalization, localization)}
        // @ts-ignore
        icons={tableIcons}
        title={
          <Title
            title={title}
            dateFilter={dateFilter}
            dateRangeFilter={dateRangeFilter}
            additionalFilter={additionalFilter}
          />
        }
        components={components}
      />
    </Paper>
  );
};

export default WxTable;
