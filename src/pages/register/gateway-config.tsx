import WxPage from '@/components/WxPage';
import WxSearchField from '@/components/WxSearchField';
import WxTableWithApi from '@/components/WxTableWithApi';
import useAuth from '@/hooks/useAuth';
import { AddCircleOutlineOutlined, Edit } from '@material-ui/icons';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants';
import React, { useRef, useState } from 'react';
import { useLocation, useModel } from 'umi';
import GatewayConfigEdit from './components/GatewayConfigEdit';
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

  const pmCreate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'gateway-config');
  const pmUpdate = getPermission([REGULAR_PERMISSIONS.UPDATE[0]], 'gateway-config');
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'gateway-config');
  useAuth(getPermission([1], 'gateway-config'));

  return (
    <WxPage
      menu={menu}
      buttonIcon={<AddCircleOutlineOutlined />}
      buttonTitle="新增配置"
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
              url: '/WxGateway/listConfig',
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
              label="容器名"
              value={name}
              onChange={setName}
            />
          </>
        }
        actions={[
          rowData => ({
            disabled: !pmUpdate,
            icon: () => <Edit color={!pmUpdate ? 'disabled' : 'primary'} />,
            tooltip: '编辑',
            onClick: (event, rowData) => {
              setCurrent(rowData);
            },
          }),
        ]}
        columns={[
          { title: '容器名', field: 'name', type: 'string' },
          { title: 'host', field: 'host', type: 'string' },
          { title: '匹配路径', render: data => data.route?.paths?.join(',') },
          { title: '附加路径', field: 'path', type: 'string' },
          { title: '端口号(Port)', field: 'port', type: 'numeric' },
          { title: '重试次数', field: 'retries', type: 'numeric' },
          { title: '连接超时时间(ms)', field: 'connect_timeout', type: 'numeric' },
          { title: '读取超时时间(ms)', field: 'read_timeout', type: 'numeric' },
          { title: '写入超时时间(ms)', field: 'write_timeout', type: 'numeric' },
        ]}
        deletable={rowData => ({
          disabled: !pmDelete || rowData.name.startsWith('wxeap-admin'),
          confirmOptions: {
            title: `删除${rowData.name}`,
            message: `确定要删除${rowData.name}吗？`,
            onConfirm: async () => {
              await buildRequest(location.state, {
                url: '/WxGateway/deleteConfig',
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
      <GatewayConfigEdit current={current} refresh={refresh} onClose={() => setCurrent(null)} />
    </WxPage>
  );
};
