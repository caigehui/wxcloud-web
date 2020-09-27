import React from 'react';
import { EditComponentProps, Column, MTableEditField } from 'material-table';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

export const SHARED_DATA_KEY = 'sharedRowData';

export default function mapColumns<T extends object>(columns: Column<T>[]): Column<T>[] {
  return columns.map((i: any) => {
    return {
      ...i,
      editComponent: (props: EditComponentProps<T>) => {
        /* eslint-disable react/prop-types */
        const onChange = (newValue: any) => {
          // 设置共享数据
          if (!columns[SHARED_DATA_KEY]) {
            columns[SHARED_DATA_KEY] = cloneDeep(props.rowData);
          }
          set(columns[SHARED_DATA_KEY], props.columnDef.field, newValue);
          props.onChange(newValue);
        };
        const onRowDataChange = (newRowData: T) => {
          columns[SHARED_DATA_KEY] = newRowData;
          props.onRowDataChange(newRowData);
        };
        /* eslint-enable react/prop-types */
        return i.editComponent ? (
          i.editComponent({ ...props, onChange, onRowDataChange })
        ) : (
          <MTableEditField {...props} onChange={onChange} onRowDataChange={onRowDataChange} />
        );
      },
      editable:
        typeof i.editable === 'function'
          ? (columnDef, rowData: T) => {
              return i.editable(columnDef, columns[SHARED_DATA_KEY] || rowData);
            }
          : i.editable,
    };
  });
}
