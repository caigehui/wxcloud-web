import { Insertable } from './actions';
import { Column } from 'material-table';
import { SHARED_DATA_KEY } from './columns';

interface MapEditable<T extends object> {
  insertable?: Insertable<T>;
  readonly?: boolean;
  myData: T[];
  columns: Column<T>[];
}

export default function mapEditable<T extends object>({
  insertable,
  readonly,
  myData,
  columns,
}: MapEditable<T>) {
  return insertable && !readonly
    ? {
        isEditHidden: () => true,
        onRowUpdate: async (newData: any, oldData: any) => {
          const dataUpdate: any = [].concat(myData);
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          const type = insertable?.onUpdate?.(dataUpdate);
          if (type instanceof Promise) {
            await type;
          }
          // 还原共享数据
          columns[SHARED_DATA_KEY] = null;
        },
        onRowUpdateCancelled: () => {
          insertable?.onUpdate?.(myData.filter(i => !i['tableData'].isNew));
          // 还原共享数据
          columns[SHARED_DATA_KEY] = null;
        },
      }
    : {};
}
