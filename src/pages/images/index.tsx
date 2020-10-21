import WxPage from '@/components/WxPage';
import WxTableWithApi from '@/components/WxTableWithApi';
import requestWxApi from '@/utils/requestWxApi';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants';
import request from '@wxsoft/wxboot/helpers/request';
import React, { createRef } from 'react';
import { useModel, history } from 'umi';

export default ({ menu }) => {
  const { getPermission } = useModel('useAuthModel');
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'images');
  const tableRef = createRef<any>();
  const refresh = () => {
    tableRef.current?.refresh();
  };

  const onWxApi = ({ page, pageSize }) => (token: string) =>
    request(
      {
        url: '/WxImages/listRepo',
        params: {
          page,
          pageSize,
        },
      },
      token,
    );

  return (
    <WxPage menu={menu} title="镜像仓库">
      <WxTableWithApi
        ref={tableRef}
        onWxApi={onWxApi}
        options={{ sorting: false }}
        onRowClick={(e, rowData) => {
          history.push('/images/' + rowData.name.substring(rowData.name.indexOf('/') + 1));
        }}
        deletable={rowData => ({
          disabled: !pmDelete,
          confirmOptions: {
            title: `删除${rowData.name}`,
            message: `确定要删除${rowData.name}吗？`,
            onConfirm: async () => {
              await requestWxApi((token: string) =>
                request(
                  {
                    url: '/WxImages/deleteRepo',
                    method: 'POST',
                    data: {
                      name: rowData.name.substring(rowData.name.indexOf('/') + 1),
                    },
                  },
                  token,
                ),
              );
              refresh();
              return true;
            },
          },
        })}
        columns={[
          { title: '镜像名称', field: 'name' },
          { title: '镜像版本数', field: 'artifact_count' },
          {
            title: '下载数',
            field: 'pull_count',
          },
          {
            title: '最新变更时间',
            field: 'update_time',
            type: 'datetime',
          },
          {
            title: '创建时间',
            field: 'creation_time',
            type: 'datetime',
          },
        ]}
      />
    </WxPage>
  );
};
