import React, { useRef, useState } from 'react';
import LevelPicker from './components/LevelPicker';
import WxPage from '@/components/WxPage';
import WxTableWithApi from '@/components/WxTableWithApi';
import { buildRequest } from './utils';
import { useLocation, useModel } from 'umi';
import WxSearchField from '@/components/WxSearchField';
import useAuth from '@/hooks/useAuth';

function JobLogs({ menu }: any) {
  const tableRef = useRef(null);
  const [level, setLevel] = useState('all');
  const [appName, setAppName] = useState('');
  const [taskName, setTaskName] = useState('');
  const location = useLocation();

  const { getPermission } = useModel('useAuthModel');
  useAuth(getPermission([1], 'joblogs'));

  const request = ({ page, pageSize, from, until }) =>
    buildRequest(location.state, {
      url: '/WxLog/queryJobLogs',
      params: {
        page,
        pageSize,
        from,
        until,
        level,
        taskName,
        appName,
      },
    }).then(i => i.data);

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
            <WxSearchField label="任务名" value={taskName} onChange={setTaskName} />
          </>
        }
        columns={[
          { title: '服务名', field: 'appName', type: 'string' },
          { title: '任务名', field: 'taskName', type: 'string' },
          { title: '日志等级', field: 'level', type: 'string' },
          {
            title: '用时(ms)',
            field: 'duration',
            type: 'string',
            cellStyle: { minWidth: 120 },
          },
          { title: '时间', field: 'timestamp.iso', type: 'datetime' },
          {
            title: '返回结果',
            type: 'string',
            field: 'result',
          },
        ]}
      />
    </WxPage>
  );
}

export default JobLogs;
