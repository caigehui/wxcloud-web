import WxPage from '@/components/WxPage';
import WxSearchField from '@/components/WxSearchField';
import WxTableWithApi from '@/components/WxTableWithApi';
import { AddCircleOutlineOutlined, Edit } from '@material-ui/icons';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants/permissions';
import React, { useRef, useState } from 'react';
import { useLocation, useModel } from 'umi';
import { buildRequest } from './utils';

export default ({ menu }) => {
  const tableRef = useRef(null);
  const [name, setName] = useState('');
  const [current, setCurrent] = useState(null);
  const location = useLocation();
  const { getPermission } = useModel('useAuthModel');

  const pmCreate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'gateway');
  const pmUpdate = getPermission([REGULAR_PERMISSIONS.UPDATE[0]], 'gateway');
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'gateway');

  const request = ({ page, pageSize }) => () =>
    buildRequest(location.state, {
      url: '/WxGateway/list',
      params: {
        page,
        pageSize,
        name,
      },
    });

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
        onWxApi={request}
        options={{ sorting: false, search: false }}
        additionalFilter={
          <>
            <WxSearchField
              style={{ marginLeft: 0 }}
              label="微服务名"
              value={name}
              onChange={setName}
            />
          </>
        }
        actions={[
          {
            disabled: !pmUpdate,
            icon: () => <Edit color="primary" />,
            tooltip: '编辑',
            onClick: (event, rowData) => {
              setCurrent(rowData);
            },
          },
        ]}
        columns={[
          { title: '微服务名', field: 'name', type: 'string' },
          { title: '协议', field: 'protocol', type: 'string' },
          { title: 'host', field: 'host', type: 'string' },
          { title: '附加路径', field: 'path', type: 'string' },
          { title: '端口号(Port)', field: 'port', type: 'numeric' },
          { title: '重试次数', field: 'retries', type: 'numeric' },
          { title: '连接超时时间(ms)', field: 'connect_timeout', type: 'numeric' },
          { title: '读取超时时间(ms)', field: 'write_timeout', type: 'numeric' },
          { title: '写入超时时间(ms)', field: 'read_timeout', type: 'numeric' },
        ]}
        // deletable={rowData => ({
        //   disabled: !pmDelete,
        //   confirmOptions: {
        //     title: `删除${rowData.name}`,
        //     message: `确定要删除${rowData.name}吗？删除后不会停止该系统的所有服务`,
        //     onConfirm: async () => {
        //       const ret = await requestWxApi((token: string) =>
        //         request(
        //           {
        //             url: '/WxRegister/delete',
        //             data: {
        //               id: rowData.id,
        //             },
        //           },
        //           token,
        //         ),
        //       );
        //       refresh();
        //       return ret;
        //     },
        //   },
        // })}
      />
    </WxPage>
  );
};
