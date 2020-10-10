import WxPage from '@/components/WxPage';
import WxSearchField from '@/components/WxSearchField';
import WxTableWithApi from '@/components/WxTableWithApi';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants/permissions';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { ArrowDownCircle } from 'react-feather';
import { useLocation, useModel } from 'umi';
import LocalImageEdit from './components/LocalImageEdit';
import { buildRequest } from './utils';

const readonlyServices = ['konga', 'kong', 'mqtt', 'mongodb', 'postgres'];

export default ({ menu }) => {
  const tableRef = useRef(null);
  const [name, setName] = useState('');
  const [current, setCurrent] = useState(null);
  const location = useLocation();
  const { getPermission } = useModel('useAuthModel');

  const refresh = () => {
    tableRef.current?.refresh();
  };
  const pmCreate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'local-images');
  const pmUpdate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'local-images');
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'local-images');

  return (
    <WxPage
      menu={menu}
      buttonIcon={<ArrowDownCircle />}
      buttonTitle="拉取镜像"
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
              url: '/WxImage/list',
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
              label="镜像Tag"
              value={name}
              onChange={setName}
            />
          </>
        }
        columns={[
          { title: '镜像Tag', render: rowData => rowData.RepoTags[0] },
          { title: '大小', render: rowData => (rowData.Size / (1024 * 1024)).toFixed(0) + 'MB' },
          {
            title: '创建时间',
            render: rowData => {
              return dayjs(rowData.Created * 1000).format('YYYY/MM/DD HH:mm:ss');
            },
          },
        ]}
        deletable={rowData => ({
          disabled: !pmDelete || readonlyServices.some(i => i === rowData.Name),
          confirmOptions: {
            title: `删除${rowData.Name}`,
            message: `确定要删除${rowData.Name}吗？`,
            onConfirm: async () => {
              await buildRequest(location.state, {
                url: '/WxMicro/delete',
                method: 'POST',
                data: {
                  id: rowData.Id,
                },
              });
              refresh();
              return true;
            },
          },
        })}
      />
      <LocalImageEdit current={current} refresh={refresh} onClose={() => setCurrent(null)} />
    </WxPage>
  );
};
