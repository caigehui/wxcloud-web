import React, { useRef, useState } from 'react';
import LevelPicker from './components/LevelPicker';
import WxPage from '@/components/WxPage';
import WxTableWithApi from '@/components/WxTableWithApi';
import { buildRequest } from './utils';
import { useLocation, useModel } from 'umi';
import WxSearchField from '@/components/WxSearchField';
import useAuth from '@/hooks/useAuth';
import { Chip, useTheme } from '@material-ui/core';

function JobLogs({ menu }: any) {
  const tableRef = useRef(null);
  const [level, setLevel] = useState('all');
  const [appName, setAppName] = useState('');
  const [url, setUrl] = useState('');
  const location = useLocation();
  const theme = useTheme();

  const { getPermission } = useModel('useAuthModel');
  useAuth(getPermission([1], 'apilogs'));

  const request = ({ page, pageSize, from, until }) =>
    buildRequest(
      location.state,
      {
        url: '/WxLog/queryApiLogs',
        params: {
          page,
          pageSize,
          from,
          until,
          level,
          url,
          appName,
        },
      },
      true,
    );

  return (
    <WxPage menu={menu}>
      <WxTableWithApi
        ref={tableRef}
        enableDateRangeFilter
        onWxApi={request}
        options={{ sorting: false, search: false }}
        additionalFilter={
          <>
            <LevelPicker value={level} onChange={setLevel} />
            <WxSearchField label="服务名" value={appName} onChange={setAppName} />
            <WxSearchField label="url" value={url} onChange={setUrl} />
          </>
        }
        columns={[
          { title: '服务名', field: 'appName', type: 'string' },
          { title: 'Url', field: 'url', type: 'string' },
          {
            title: '日志等级',
            field: 'level',
            render: data => (
              <Chip
                label={data.level}
                style={{
                  background:
                    data.level === 'error'
                      ? theme.palette.error.main
                      : data.level === 'warn'
                      ? theme.palette.warning.main
                      : theme.palette.primary.main,
                }}
              />
            ),
          },
          { title: '用户ID', field: 'userId' },
          {
            title: '用户名',
            render: data => (data.username ? data.username + `(${data.nickname})` : ''),
          },
          {
            title: '用时(ms)',
            field: 'duration',
            type: 'string',
            cellStyle: { minWidth: 120 },
          },
          { title: '时间', field: 'timestamp.iso', type: 'datetime' },
          {
            title: '请求参数',
            cellStyle: { maxWidth: 300, overflow: 'auto' },
            render: data =>
              JSON.stringify(typeof data.request === 'object' && data.request ? data.request : {}),
          },
          {
            title: '返回结果',
            cellStyle: { maxWidth: 300, overflow: 'auto' },
            render: data =>
              JSON.stringify(
                typeof data.response === 'object' && data.response ? data.response : {},
              ),
          },
        ]}
      />
    </WxPage>
  );
}

export default JobLogs;
