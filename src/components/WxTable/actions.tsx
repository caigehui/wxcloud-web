import React from 'react';
import AddBox from '@material-ui/icons/AddBox';
import Delete from '@material-ui/icons/Delete';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Edit from '@material-ui/icons/Edit';
import wxConfirm, { WxConfirmOptions } from '../WxConfirm';
import { Action } from 'material-table';

/**
 * 新增和插入
 */
export type Insertable<T extends object> = {
  /**
   * 是否允许新增
   */
  isNewable?: boolean;
  /**
   * 是否显示新增按钮
   */
  showNewButton?: boolean;
  /**
   * 该行是否可编辑
   */
  isEditable?: (rowData: T) => boolean;
  /**
   * 更新
   */
  onUpdate?: (newData: Array<T>) => Promise<any> | void;
};

/**
 * 删除
 */
export type Deletable<T> = (
  rowData: T,
) => {
  confirmOptions: WxConfirmOptions;
  disabled?: boolean;
};

/**
 * 上下移动
 */
export type Sortable<T extends object> = {
  onSort?: (
    rowData: T,
    index: number,
    type: 'up' | 'down',
    newData: Array<any>,
  ) => Promise<any> | void;
};

/**
 * 额外操作
 */
export type Actions<T extends object> = Array<Action<T> | ((rowData: T) => Action<T>)>;

interface MapActions<T extends object> {
  myData: T[];
  setMyData: (newValue: T[]) => void;
  onEditRow: (event: any, data: T) => void;
  insertable?: Insertable<T>;
  deletable?: Deletable<T>;
  sortable?: Sortable<T>;
  readonly?: boolean;
  actions?: Actions<T>;
  setLoading?: (loading: boolean) => void;
}

export default function mapActions<T extends object>({
  myData,
  setMyData,
  onEditRow,
  insertable,
  deletable,
  sortable,
  readonly,
  actions,
  setLoading,
}: MapActions<T>): Actions<T> {
  return [
    ...(insertable && !readonly
      ? [
          {
            icon: () => <AddBox color="primary" />,
            tooltip: '新增',
            onClick: (event, rowData) => {
              // 计算出当前行index
              const rowIndex = myData.findIndex(i => i === rowData);
              const newRow = {
                tableData: { isNew: true },
              };
              const newData: any = [
                ...myData.slice(0, rowIndex + 1),
                newRow,
                ...myData.slice(rowIndex + 1),
              ];
              // 插入新的一行，并且设置为编辑状态
              setMyData(newData);
            },
          },
          rowData => {
            const disabled = insertable.isEditable ? !insertable.isEditable(rowData) : false;
            return {
              disabled,
              icon: () => <Edit color={disabled ? 'disabled' : 'primary'} />,
              tooltip: '编辑',
              onClick: onEditRow,
            };
          },
          ...(insertable.showNewButton
            ? [
                {
                  disabled: !insertable.isNewable,
                  icon: () => <AddBox color={insertable.isNewable ? 'primary' : 'disabled'} />,
                  tooltip: '新增',
                  isFreeAction: true,
                  onClick: () => {
                    const newRow = {
                      tableData: { isNew: true },
                    };
                    const newData: any = [newRow, ...myData];
                    // 插入新的一行，并且设置为编辑状态
                    setMyData(newData);
                  },
                },
              ]
            : []),
        ]
      : []),
    ...(deletable && !readonly
      ? [
          rowData => ({
            icon: () => <Delete color={deletable(rowData).disabled ? 'disabled' : 'primary'} />,
            disabled: deletable(rowData).disabled,
            tooltip: '删除',
            onClick: (event, rowData: any) => {
              wxConfirm(deletable(rowData).confirmOptions);
            },
          }),
        ]
      : []),
    ...(sortable && !readonly
      ? [
          {
            icon: () => <ArrowUpward color="primary" />,
            tooltip: '上移',
            onClick: async (event, rowData) => {
              const newData = [...myData];
              const index = rowData.tableData.id;
              if (index !== 0) {
                const temp = newData[index];
                newData[index] = newData[index - 1];
                newData[index - 1] = temp;
              }
              const type = sortable.onSort?.(rowData, rowData.tableData.id, 'up', newData);
              if (type instanceof Promise) {
                setLoading(true);
                await type;
                setLoading(false);
              }
            },
          },
          {
            icon: () => <ArrowDownward color="primary" />,
            tooltip: '下移',
            onClick: async (event, rowData) => {
              const newData = [...myData];
              const index = rowData.tableData.id;
              if (index !== myData.length - 1) {
                const temp = newData[index];
                newData[index] = newData[index + 1];
                newData[index + 1] = temp;
              }
              const type = sortable.onSort?.(rowData, rowData.tableData.id, 'down', newData);
              if (type instanceof Promise) {
                setLoading(true);
                await type;
                setLoading(false);
              }
            },
          },
        ]
      : []),
    ...(readonly ? [] : actions || []),
  ] as Actions<T>;
}
