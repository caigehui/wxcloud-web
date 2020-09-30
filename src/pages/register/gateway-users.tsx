import WxPage from '@/components/WxPage';
import WxSearchField from '@/components/WxSearchField';
import WxTableWithApi from '@/components/WxTableWithApi';
import { AddCircleOutlineOutlined } from '@material-ui/icons';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants/permissions';
import React, { useRef, useState } from 'react';
import { useLocation, useModel } from 'umi';
import GatewayUserEdit from './components/GatewayUserEdit';
import { buildRequest } from './utils';

export default ({ menu }) => {
  const tableRef = useRef(null);
  const [name, setName] = useState('');
  const [current, setCurrent] = useState(null);
  const location = useLocation();
  const { getPermission } = useModel('useAuthModel');

  const refresh = () => {
    tableRef.current?.refresh();
  };

  const pmCreate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'gateway-users');
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'gateway-users');

  return (
    <WxPage
      menu={menu}
      buttonIcon={<AddCircleOutlineOutlined />}
      buttonTitle="新增用户"
      buttonDiabled={!pmCreate}
      onButtonClick={() => {
        setCurrent({ isNew: true });
      }}
    >
      <WxTableWithApi
        ref={tableRef}
        onWxApi={() => () =>
          buildRequest(
            location.state,
            {
              url: '/WxGateway/listUsers',
              params: {
                name,
              },
            },
            true,
          )}
        options={{ sorting: false, search: false }}
        additionalFilter={
          <>
            <WxSearchField
              style={{ marginLeft: 0 }}
              label="用户名"
              value={name}
              onChange={setName}
            />
          </>
        }
        columns={[
          { title: '用户名', field: 'username', type: 'string' },
          { title: 'API KEY', field: 'key', type: 'string' },
          { title: '创建时间', field: 'created_at', type: 'datetime' },
        ]}
        deletable={rowData => ({
          disabled: !pmDelete || rowData.username === 'admin',
          confirmOptions: {
            title: `删除${rowData.username}`,
            message: `确定要删除${rowData.username}吗？`,
            onConfirm: async () => {
              await buildRequest(location.state, {
                url: '/WxGateway/deleteUser',
                method: 'POST',
                data: {
                  id: rowData.id,
                },
              });
              refresh();
              return true;
            },
          },
        })}
      />
      <GatewayUserEdit current={current} refresh={refresh} onClose={() => setCurrent(null)} />
    </WxPage>
  );
};
