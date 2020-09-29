import WxPage from '@/components/WxPage';
import WxTableWithApi from '@/components/WxTableWithApi';
import { AddCircleOutlineOutlined, Edit, ExitToApp, Search } from '@material-ui/icons';
import request from '@wxsoft/wxboot/helpers/request';
import React, { createRef, useState } from 'react';
import { useHistory, useModel } from 'umi';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants/permissions';
import requestWxApi from '@/utils/requestWxApi';
import Create from './components/Create';
import WxSnackBar from '@/components/WxSnackBar';
import { useRequest } from 'ahooks';
import { buildRequest } from './utils';
import { Box, InputAdornment, TextField } from '@material-ui/core';

export default ({ menu }: any) => {
  const { getPermission } = useModel('useAuthModel');
  const tableRef = createRef<any>();
  const [current, setCurrent] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  //const [token, setToken] = useState(null);
  const history = useHistory();

  // 测试连通性
  const { loading, run } = useRequest(
    data =>
      buildRequest(data, {
        url: '/WxDevelop/about',
      }),
    {
      loadingDelay: 500,
      manual: true,
      throwOnError: true,
    },
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

  const onWxApi = ({ page, pageSize, from, until }) => (token: string) =>
    request(
      {
        url: '/WxRegister/list',
        params: {
          page,
          pageSize,
          conditions: JSON.stringify([
            nameSearch && ['name', 'contains', nameSearch],
            from && ['createdAt', 'greaterThanOrEqualTo', from],
            until && ['createdAt', 'lessThanOrEqualTo', until],
          ]),
          includeKeys: 'createdBy.username,managedBy',
        },
      },
      token,
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
              placeholder="搜索单位名称"
              variant="outlined"
              margin="dense"
              label="单位名称"
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
              refresh();
              return ret;
            },
          },
        })}
        options={{ sorting: false }}
        columns={[
          { title: '单位代号', field: 'code' },
          { title: '单位名称', field: 'name' },
          {
            title: '访问地址',
            field: 'url',
          },
          {
            title: '管理人员',
            render: data => data.managedBy?.map(i => i.nickname).join(','),
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
      <Create current={current} refresh={refresh} onClose={() => setCurrent(null)} />
    </WxPage>
  );
};
