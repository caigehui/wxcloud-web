import WxPage from '@/components/WxPage';
import WxTableWithApi from '@/components/WxTableWithApi';
import { AddCircleOutlineOutlined, Edit, Search } from '@material-ui/icons';
import request from '@wxsoft/wxboot/helpers/request';
import React, { createRef, useState } from 'react';
import { useModel } from 'umi';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants/permissions';
import requestWxApi from '@/utils/requestWxApi';
import { Box, InputAdornment, TextField } from '@material-ui/core';
import UserEdit from './components/UserEdit';
import { useRequest } from 'ahooks';
import useAuth from '@/hooks/useAuth';

export default ({ menu }: any) => {
  const { getPermission, user } = useModel('useAuthModel');
  const tableRef = createRef<any>();
  const [current, setCurrent] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');

  const refresh = () => {
    tableRef.current?.refresh();
  };

  const pmCreate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'users');
  const pmUpdate = getPermission([REGULAR_PERMISSIONS.UPDATE[0]], 'users');
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'users');

  useAuth(getPermission([REGULAR_PERMISSIONS.READ[0]], 'users'));

  const onWxApi = ({ page, pageSize }) => (token: string) =>
    request(
      {
        url: '/WxUser/list',
        params: {
          page,
          pageSize,
          phoneNumber: phoneSearch,
          name: nameSearch,
        },
      },
      token,
    );

  const { data: permissions } = useRequest(
    () =>
      requestWxApi(token =>
        request(
          {
            url: '/WxPermission/list',
          },
          token,
        ),
      ),
    { initialData: {} },
  );

  return (
    <WxPage
      menu={menu}
      title="用户管理"
      buttonIcon={<AddCircleOutlineOutlined />}
      onButtonClick={() => {
        setCurrent({ isNew: true });
      }}
      buttonTitle="新增用户"
      buttonDiabled={!pmCreate}
    >
      <WxTableWithApi
        ref={tableRef}
        onWxApi={onWxApi}
        additionalFilter={
          <>
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
                placeholder="搜索用户昵称"
                variant="outlined"
                margin="dense"
                label="用户昵称"
                value={nameSearch}
                onChange={e => setNameSearch(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && refresh()}
              />
            </Box>
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
                placeholder="搜索手机号码"
                variant="outlined"
                margin="dense"
                label="手机号码"
                value={phoneSearch}
                onChange={e => setPhoneSearch(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && refresh()}
              />
            </Box>
          </>
        }
        actions={[
          rowData => ({
            disabled:
              !pmUpdate || rowData.username === user['username'] || rowData.username === 'admin',
            icon: () => (
              <Edit
                color={
                  !pmUpdate || rowData.username === user['username'] || rowData.username === 'admin'
                    ? 'disabled'
                    : 'primary'
                }
              />
            ),
            tooltip: '编辑',
            onClick: (event, rowData) => {
              setCurrent(rowData);
            },
          }),
        ]}
        deletable={rowData => ({
          disabled:
            !pmDelete || rowData.username === 'admin' || rowData.username === user['username'],
          confirmOptions: {
            title: `删除${rowData.nickname}`,
            message: `确定要删除${rowData.nickname}吗？`,
            onConfirm: async () => {
              await requestWxApi((token: string) =>
                request(
                  {
                    url: '/WxUser/delete',
                    method: 'POST',
                    data: {
                      id: rowData.objectId,
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
        options={{ sorting: false }}
        columns={[
          { title: '账号', field: 'username' },
          { title: '昵称', field: 'nickname' },
          {
            title: '手机号码',
            field: 'phoneNumber',
          },
          {
            title: '电子邮件',
            field: 'email',
          },
          {
            title: '创建时间',
            field: 'createdAt',
            type: 'datetime',
          },
        ]}
      />
      <UserEdit
        menu={menu}
        permissions={permissions}
        current={current}
        refresh={refresh}
        onClose={() => setCurrent(null)}
      />
    </WxPage>
  );
};
