import WxPage from '@/components/WxPage';
import WxSearchField from '@/components/WxSearchField';
import WxSnackBar from '@/components/WxSnackBar';
import WxTableWithApi from '@/components/WxTableWithApi';
import { GITLAB_URL } from '@/constants';
import { Avatar, Box, IconButton, Link, Typography, useTheme } from '@material-ui/core';
import {
  AddCircleOutlineOutlined,
  AssistantPhotoSharp,
  Edit,
  ExitToApp,
  FileCopy,
} from '@material-ui/icons';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants';

import React, { createRef, useState } from 'react';
import { useModel } from 'umi';
import ProjectEdit from './components/ProjectEdit';
import git, { GitProgressEvent } from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import LightningFS from '@isomorphic-git/lightning-fs';
import requestWxApi from '@/utils/requestWxApi';
const fs = new LightningFS('fs', { wipe: true });

export default ({ menu }) => {
  const { user, getPermission } = useModel('useAuthModel');
  const [current, setCurrent] = useState(null);

  const [name, setName] = useState('');
  const tableRef = createRef<any>();
  const theme = useTheme();
  const refresh = () => {
    tableRef.current?.refresh();
  };
  const pmGitlab = getPermission([REGULAR_PERMISSIONS.CREATE[12]], 'code');

  const onWxApi = ({ page, pageSize }) =>
    requestWxApi({
      url: '/WxCode/listProjects',
      params: {
        name,
        page,
        pageSize,
      },
    });

  const enter = (e, rowData) => {
    window.open('/code/' + rowData.name);
  };

  return (
    <WxPage
      menu={menu}
      title="开发项目"
      buttonIcon={<AddCircleOutlineOutlined />}
      buttonTitle="新建项目"
      buttonDiabled={!pmGitlab}
      onButtonClick={() => {
        setCurrent({ isNew: true });
      }}
    >
      <WxTableWithApi
        ref={tableRef}
        onWxApi={onWxApi}
        options={{ sorting: false }}
        onRowClick={enter}
        additionalFilter={
          <>
            <WxSearchField
              style={{ marginLeft: 0 }}
              label="项目名"
              value={name}
              onChange={setName}
            />
          </>
        }
        actions={[
          {
            disabled: !pmGitlab,
            icon: () => <Edit color={!pmGitlab ? 'disabled' : 'primary'} />,
            tooltip: '编辑',
            onClick: (event, rowData) => {
              setCurrent(rowData);
            },
          },
          {
            icon: () => <ExitToApp color="primary" />,
            tooltip: '查看详情',
            onClick: async (e, rowData) => {
              e.stopPropagation();
              // git.clone({
              //   fs,
              //   http,
              //   dir: `/${rowData.name}`,
              //   corsProxy: 'https://cors.isomorphic-git.org',
              //   url: `https://gitlab.wxsoft.cn/wxsoft/${rowData.name}.git`,
              //   onAuth: () => {
              //     return {
              //       username: 'robot',
              //       password: 'cnwxsoft',
              //     };
              //   },
              //   onProgress: (progress: GitProgressEvent) => {
              //     const msg = `${progress.phase}, loaded: ${progress.loaded},  ${
              //       progress.total ? `total${progress.total}` : ''
              //     }`;
              //     console.log(msg);
              //   },
              //   onAuthFailure: (...args) => {
              //     console.log('failed', ...args);
              //   },
              //   onAuthSuccess: (...args) => {
              //     console.log('successed', ...args);
              //   },
              // });
            },
          },
        ]}
        columns={[
          {
            title: '项目名称',
            field: 'name',
            render: rowData => {
              return (
                <Box display="flex" alignItems="center">
                  <Avatar
                    style={{
                      width: 36,
                      height: 36,
                      marginRight: theme.spacing(2),
                      background: theme.palette.secondary.main,
                    }}
                    src={rowData.avatar_url + `?private_token=${user['gitlabToken']}`}
                  >
                    <AssistantPhotoSharp />
                  </Avatar>
                  <Typography>{rowData.name}</Typography>
                </Box>
              );
            },
          },
          { title: '项目描述', field: 'description' },
          {
            title: '项目地址',
            cellStyle: { width: 500 },
            render: data => {
              return (
                <Box display="flex" alignItems="center" color={theme.palette.text.primary}>
                  <IconButton
                    color="inherit"
                    onClick={e => {
                      e.stopPropagation();
                      navigator.clipboard
                        .writeText(data.http_url_to_repo.replace('http://192.168.0.8', GITLAB_URL))
                        .then(() => WxSnackBar.info('已复制到粘贴板'));
                    }}
                  >
                    <FileCopy />
                  </IconButton>
                  <Link
                    href={data.http_url_to_repo.replace('http://192.168.0.8', GITLAB_URL)}
                    target="_blank"
                    onClick={e => e.stopPropagation()}
                  >
                    {data.http_url_to_repo.replace('http://192.168.0.8', GITLAB_URL)}
                  </Link>
                </Box>
              );
            },
          },
          {
            title: '最后活跃时间',
            field: 'last_activity_at',
            type: 'datetime',
          },
          {
            title: '创建时间',
            field: 'created_at',
            type: 'datetime',
          },
        ]}
      />
      <ProjectEdit current={current} refresh={refresh} onClose={() => setCurrent(null)} />
    </WxPage>
  );
};
