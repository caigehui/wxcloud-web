import WxPage from '@/components/WxPage';
import WxTableWithApi from '@/components/WxTableWithApi';
import requestWxApi from '@/utils/requestWxApi';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants';
import request from '@wxsoft/wxboot/helpers/request';
import React, { createRef } from 'react';
import { useModel } from 'umi';

export default ({ menu, location }) => {
  const name = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
  const { getPermission } = useModel('useAuthModel');
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'images');

  const tableRef = createRef<any>();
  const refresh = () => {
    tableRef.current?.refresh();
  };

  const onWxApi = ({ page, pageSize }) => (token: string) =>
    request(
      {
        url: '/WxImages/listArtifacts',
        params: {
          name,
          page,
          pageSize,
        },
      },
      token,
    );

  return (
    <WxPage menu={menu} title={name} showBackIcon>
      <WxTableWithApi
        ref={tableRef}
        onWxApi={onWxApi}
        options={{ sorting: false }}
        deletable={rowData => ({
          disabled: !pmDelete,
          confirmOptions: {
            title: `删除${rowData.digest.substring(0, 15)}`,
            message: `确定要删除${rowData.digest.substring(0, 15)}吗？`,
            onConfirm: async () => {
              await requestWxApi((token: string) =>
                request(
                  {
                    url: '/WxImages/deleteArtifact',
                    method: 'POST',
                    data: {
                      name,
                      digest: rowData.digest,
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
          { title: '版本特征码', render: data => data.digest.substring(0, 15) },
          { title: 'Tags', render: data => data.tags?.map(i => i.name).join(', ') },
          {
            title: '大小',
            render: data => `${(data.size / (1024 * 1024)).toFixed(2)}MB`,
          },
          {
            title: '推送时间',
            field: 'push_time',
            type: 'datetime',
          },
          {
            title: '拉取时间',
            field: 'pull_time',
            type: 'datetime',
          },
        ]}
      />
    </WxPage>
  );
};
