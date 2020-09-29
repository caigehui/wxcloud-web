import React, { useRef, useState } from 'react';
import LevelPicker from './components/LevelPicker';
import { TextField } from '@material-ui/core';
import WxPage from '@/components/WxPage';
import WxTableWithApi from '@/components/WxTableWithApi';
import { buildRequest } from './utils';
import { useLocation } from 'umi';

function JobLogs({ menu }: any) {
  const tableRef = useRef(null);
  const [level, setLevel] = useState('all');
  const [taskName, setTaskName] = useState('');
  const location = useLocation();

  const request = ({ page, pageSize, from, until }) => () =>
    buildRequest(location.state, {
      url: '/WxLog/queryJobLogs',
      params: {
        page,
        pageSize,
        from,
        until,
        level,
        taskName,
      },
    });

  return (
    <WxPage menu={menu}>
      <WxTableWithApi
        ref={tableRef}
        title="定时任务日志"
        enableDateRangeFilter
        onWxApi={request}
        options={{ sorting: false, search: false }}
        additionalFilter={
          <>
            <LevelPicker value={level} onChange={setLevel} />
            <TextField
              style={{ marginLeft: 16 }}
              variant="outlined"
              margin="dense"
              value={taskName}
              label="任务名"
              onChange={e => setTaskName(e.target.value)}
            />
          </>
        }
        columns={[
          { title: '时间', field: 'timestamp.iso', type: 'datetime' },
          { title: '任务名', field: 'taskName', type: 'string' },
          {
            title: '用时(ms)',
            field: 'duration',
            type: 'string',
            cellStyle: { minWidth: 120 },
          },
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
