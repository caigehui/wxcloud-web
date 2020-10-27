import WxPage from '@/components/WxPage';
import WxTableWithApi from '@/components/WxTableWithApi';
import requestWxApi from '@/utils/requestWxApi';
import { Chip, Link, MenuItem, TextField, useTheme } from '@material-ui/core';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants';
import request from '@wxsoft/wxboot/helpers/request';
import React, { createRef, useState } from 'react';
import { useModel } from 'umi';
import { colors } from '@material-ui/core';
import WxSearchField from '@/components/WxSearchField';
import { Description, Replay } from '@material-ui/icons';
import { SocketIOProvider, useSocket } from 'use-socketio';
import BuildLog from './components/BuildLog';

enum BUILD_STATUS {
  WAITING = 1,
  BUILDING = 2,
  FINISHED = 3,
  FAILED = 4,
}

const Builds = ({ menu }) => {
  const { getPermission } = useModel('useAuthModel');
  const [nameSearch, setNameSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [buildLog, setBuildLog] = useState(null);
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'builds');
  const pmUpdate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'builds');
  const theme = useTheme();
  const tableRef = createRef<any>();
  const refresh = () => {
    tableRef.current?.refresh();
  };

  useSocket('buildChanges', () => {
    refresh();
  });

  const onWxApi = ({ page, pageSize }) => (token: string) =>
    request(
      {
        url: '/WxBuilds/list',
        params: {
          page,
          pageSize,
          conditions: JSON.stringify([
            nameSearch && ['project', 'contains', nameSearch],
            status !== 'all' && ['status', 'equalTo', parseInt(status)],
          ]),
          includeKeys: 'user',
        },
      },
      token,
    );

  return (
    <WxPage menu={menu} title="构建任务">
      <WxTableWithApi
        ref={tableRef}
        onWxApi={onWxApi}
        options={{ sorting: false }}
        additionalFilter={
          <>
            <WxSearchField
              style={{ marginLeft: 0 }}
              label="项目名"
              value={nameSearch}
              onChange={setNameSearch}
            />
            <TextField
              select
              label="状态"
              style={{ width: 150, marginLeft: theme.spacing(2) }}
              value={status}
              onChange={e => setStatus(e.target.value)}
              variant="outlined"
              margin="dense"
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="1">等待构建</MenuItem>
              <MenuItem value="2">构建中</MenuItem>
              <MenuItem value="3">完成构建</MenuItem>
              <MenuItem value="4">构建失败</MenuItem>
            </TextField>
          </>
        }
        deletable={rowData => ({
          disabled: !pmDelete,
          confirmOptions: {
            title: `删除${rowData.project}的构建任务`,
            message: `确定要删除${rowData.project}的构建任务吗？`,
            onConfirm: async () => {
              await requestWxApi((token: string) =>
                request(
                  {
                    url: '/WxBuilds/delete',
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
        actions={[
          {
            disabled: !pmUpdate,
            icon: () => <Replay color="primary" />,
            tooltip: '重试',
            onClick: async (event, rowData) => {
              await requestWxApi((token: string) =>
                request(
                  {
                    url: '/WxBuilds/retry',
                    method: 'POST',
                    data: {
                      id: rowData.objectId,
                    },
                  },
                  token,
                ),
              );
              refresh();
            },
          },
          {
            icon: () => <Description color="primary" />,
            tooltip: '查看日志',
            onClick: async (event, rowData) => {
              setBuildLog(rowData);
            },
          },
        ]}
        columns={[
          { title: '项目', field: 'project' },
          {
            title: '标签',
            field: 'tag',
          },
          {
            title: 'commit',
            render: data => (
              <Link href={data.commitUrl} target="_blank">
                {data.commit.substr(0, 7)}
              </Link>
            ),
          },
          {
            title: '状态',
            render: data => {
              let label,
                color = '';
              switch (data.status) {
                case BUILD_STATUS.WAITING:
                  label = '等待构建';
                  color = colors.orange['300'];
                  break;
                case BUILD_STATUS.BUILDING:
                  label = '构建中';
                  color = theme.palette.primary.main;
                  break;
                case BUILD_STATUS.FINISHED:
                  label = '完成构建';
                  color = colors.green['500'];
                  break;
                case BUILD_STATUS.FAILED:
                  label = '构建失败';
                  color = colors.red['400'];
                  break;
              }
              return <Chip label={label} style={{ backgroundColor: color }} />;
            },
          },
          {
            title: '耗时(s)',
            field: 'duration',
          },
          {
            title: '创建人',
            field: 'user.nickname',
          },
          {
            title: '创建时间',
            field: 'createdAt',
            type: 'datetime',
          },
        ]}
      />
      <BuildLog onClose={() => setBuildLog(null)} buildLog={buildLog} />
    </WxPage>
  );
};

export default props => {
  return (
    <SocketIOProvider url="/" opts={{  path: '/wxcloud-socket', transports: ['polling'] }}>
      <Builds {...props} />
    </SocketIOProvider>
  );
};
