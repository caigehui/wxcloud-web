import WxPage from '@/components/WxPage';
import WxTableWithApi from '@/components/WxTableWithApi';
import { AddCircleOutlineOutlined, Edit } from '@material-ui/icons';
import request from '@wxsoft/wxboot/helpers/request';
import React, { useCallback, useState } from 'react';
import { useModel } from 'umi';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants/permissions';
import requestWxApi from '@/utils/requestWxApi';
import Create from './components/Create';

export default ({ menu }: any) => {
  const { getPermission } = useModel('useAuthModel');
  const [current, setCurrent] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const pmCreate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'register');
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'register');

  const onWxApi = useCallback(
    ({ page, pageSize }) => (token: string) =>
      request(
        {
          url: '/WxRegister/list',
          params: {
            page,
            pageSize,
            includeKeys: 'createdBy.username',
          },
        },
        token,
      ),
    [],
  );

  return (
    <WxPage
      menu={menu}
      title="服务注册"
      buttonIcon={<AddCircleOutlineOutlined />}
      onButtonClick={() => {
        setCurrent({ isNew: true });
      }}
      buttonTitle="新增服务"
      buttonDiabled={!pmCreate}
    >
      <WxTableWithApi
        deps={[refreshCount]}
        onWxApi={onWxApi}
        actions={[
          {
            icon: () => <Edit color="primary" />,
            tooltip: '编辑',
            onClick: (event, rowData) => {
              setCurrent(rowData);
            },
          },
        ]}
        deletable={rowData => ({
          disabled: !pmDelete,
          confirmOptions: {
            title: `删除${rowData.name}`,
            message: `确定要删除${rowData.name}吗？删除后不会停止该系统的所有服务`,
            onConfirm: async () => {
              const ret = await requestWxApi((token: string) =>
                request(
                  {
                    url: '/WxRegister/delete',
                    data: {
                      id: rowData.id,
                    },
                  },
                  token,
                ),
              );
              setRefreshCount(refreshCount + 1);
              return ret;
            },
          },
        })}
        options={{ sorting: false }}
        columns={[
          { title: '单位代号', field: 'code' },
          { title: '单位名称', field: 'name' },
          {
            title: 'Secret',
            field: 'secret',
          },
          {
            title: '访问地址',
            field: 'url',
          },
          {
            title: '创建者',
            field: 'createdBy.username',
          },
          {
            title: '创建时间',
            field: 'createdAt',
            type: 'datetime',
          },
        ]}
      />
      <Create current={current} onClose={() => setCurrent(null)} />
    </WxPage>
  );
};
