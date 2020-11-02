import WxPage from '@/components/WxPage';
import WxTableWithApi from '@/components/WxTableWithApi';
import { AddCircleOutlineOutlined, Edit, ExitToApp, Search } from '@material-ui/icons';

import React, { createRef, useState } from 'react';
import { useHistory, useModel } from 'umi';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants';
import requestWxApi from '@/utils/requestWxApi';
import RegisterEdit from './components/RegisterEdit';
import WxSnackBar from '@/components/WxSnackBar';
import { useRequest } from 'ahooks';
import { buildRequest } from './utils';
import { Box, InputAdornment, Link, TextField } from '@material-ui/core';
import useAuth from '@/hooks/useAuth';

export default ({ menu }: any) => {
  const { getPermission } = useModel('useAuthModel');
  const tableRef = createRef<any>();
  const [current, setCurrent] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  const history = useHistory();

  // 测试连通性
  const { loading, run } = useRequest(
    data =>
      buildRequest(
        data,
        {
          timeout: 2000,
          timeoutErrorMessage: '连接超时',
          url: '/WxDevelop/about',
        },
        true,
      ),
    {
      loadingDelay: 500,
      manual: true,
      throwOnError: true,
    },
  );

  const { data: usernames } = useRequest(() =>
    requestWxApi({
      url: '/WxRegister/getUserNames',
    }),
  );

  const refresh = () => {
    tableRef.current?.refresh();
  };

  const enter = async (e, rowData) => {
    if (loading) return;
    try {
      WxSnackBar.loading('正在连接服务器');
      await run(rowData);
      WxSnackBar.stopLoading();
      history.push('/register/general', rowData);
    } catch (error) {
      WxSnackBar.stopLoading();
      WxSnackBar.error('无法访问该服务器');
    }
  };

  const pmCreate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'register');
  const pmUpdate = getPermission([REGULAR_PERMISSIONS.UPDATE[0]], 'register');
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'register');

  useAuth(getPermission([REGULAR_PERMISSIONS.READ[0]], 'register'));

  const onWxApi = ({ page, pageSize, from, until }) =>
    requestWxApi({
      url: '/WxRegister/list',
      params: {
        page,
        pageSize,
        conditions: JSON.stringify([
          nameSearch && ['name', 'contains', nameSearch],
          from && ['createdAt', 'greaterThanOrEqualTo', from],
          until && ['createdAt', 'lessThanOrEqualTo', until],
        ]),
        includeKeys: 'createdBy,managedBy',
      },
    });

  return (
    <WxPage
      menu={menu}
      title="服务器注册"
      buttonIcon={<AddCircleOutlineOutlined />}
      onButtonClick={() => {
        setCurrent({ isNew: true });
      }}
      buttonTitle="新增服务"
      buttonDiabled={!pmCreate}
    >
      <WxTableWithApi
        ref={tableRef}
        localization={{ toolbar: { searchPlaceholder: '搜索名称' } }}
        enableDateRangeFilter
        dateRangeFilterLabel="创建日期:"
        onWxApi={onWxApi}
        onRowClick={enter}
        additionalFilter={
          <Box ml={1}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              style={{ width: 220 }}
              placeholder="搜索服务器名称"
              variant="outlined"
              margin="dense"
              label="服务器名称"
              value={nameSearch}
              onChange={e => setNameSearch(e.target.value)}
            />
          </Box>
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
          {
            disabled: !pmUpdate,
            icon: () => <ExitToApp color="primary" />,
            tooltip: '管理',
            onClick: enter,
          },
        ]}
        deletable={rowData => ({
          disabled: !pmDelete,
          confirmOptions: {
            title: `删除${rowData.name}`,
            message: `确定要删除${rowData.name}吗？删除后不会停止该系统的所有服务`,
            onConfirm: async () => {
              await requestWxApi({
                url: '/WxRegister/delete',
                method: 'POST',
                data: {
                  id: rowData.objectId,
                },
              });
              refresh();
              return true;
            },
          },
        })}
        options={{ sorting: false }}
        columns={[
          { title: '服务器代号', field: 'code' },
          { title: '服务器名称', field: 'name' },
          {
            title: '访问地址',
            render: data => (
              <Link href={data.url} target="_blank" onClick={e => e.stopPropagation()}>
                {data.url}
              </Link>
            ),
          },
          {
            title: '管理人员',
            render: data => data.managedBy?.map(i => i.nickname).join(','),
          },
          {
            title: '创建者',
            field: 'createdBy.nickname',
          },
          {
            title: '创建时间',
            field: 'createdAt',
            type: 'datetime',
          },
        ]}
      />
      <RegisterEdit
        current={current}
        usernames={usernames || []}
        refresh={refresh}
        onClose={() => setCurrent(null)}
      />
    </WxPage>
  );
};
