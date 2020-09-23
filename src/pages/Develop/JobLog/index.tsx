import React, { useState } from 'react';
import { WxLogApi } from '@wxapi/wxeap-admin';
import { LevelPicker } from '../utils/devleop';
import { TextField } from '@material-ui/core';
import WxPage from '@wxsoft/wxcomponents/lib/WxPage';
import WxTableWithApi from '@wxsoft/wxcomponents/lib/WxTableWithApi';

function JobLog({ menu }: any) {
  const [level, setLevel] = useState('all');
  const [taskName, setTaskName] = useState('');

  const request = ({ page, pageSize, from, until }) =>
    WxLogApi.getJobLogs({
      page,
      pageSize,
      from,
      until,
      level,
      taskName,
    });

  return (
    <WxPage menu={menu}>
      <WxTableWithApi
        title="定时任务日志"
        enableDateRangeFilter
        deps={[level, taskName]}
        onWxApi={request}
        options={{ sorting: false }}
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
          { title: '时间', field: 'timestamp', type: 'datetime' },
          { title: '任务名', field: 'message.taskName', type: 'string' },
          {
            title: '用时(ms)',
            field: 'message.duration',
            type: 'string',
            cellStyle: { minWidth: 120 },
          },
          {
            title: '返回结果',
            type: 'string',
            field: 'message.result',
          },
        ]}
      />
    </WxPage>
  );
}

export default JobLog;
