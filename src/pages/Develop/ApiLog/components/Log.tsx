import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem } from '@material-ui/core';
import { WxLogApi } from '@wxapi/wxeap-admin';
import { JSONViewer } from '../../utils/devleop';
import WxTableWithApi from '@/components/WxTableWithApi';
import WxEmpty from '@/components/WxEmpty';

function Log({ tab, current }: any) {
  const [item, setItem] = useState<any>(current.properties?.[0]);
  const [level, setLevel] = useState('all');

  useEffect(() => {
    setItem(current.properties?.[0]);
  }, [current]);

  const request = ({ page, pageSize, from, until }) =>
    WxLogApi.getApiLogs({
      page,
      pageSize,
      from,
      until,
      level,
      url: `/${current.name.replace('Controller', '')}/${item.name}`,
    });

  return tab === 'Log' ? (
    <Box display="flex" flexDirection="column" height="100%">
      <TextField
        style={{ marginBottom: 16 }}
        select
        fullWidth
        label="接口"
        variant="outlined"
        margin="dense"
        value={item.name}
        onChange={e => setItem(current.properties.find(i => i.name === e.target.value))}
      >
        {current?.properties?.map(i => (
          <MenuItem key={i.name} value={i.name}>
            {i.name}
          </MenuItem>
        ))}
      </TextField>
      {item ? (
        <WxTableWithApi
          enableDateRangeFilter
          deps={[item, level]}
          onWxApi={request}
          options={{ sorting: false }}
          additionalFilter={
            <TextField
              select
              label="level"
              style={{ width: 100 }}
              value={level}
              onChange={e => setLevel(e.target.value)}
              variant="outlined"
              margin="dense"
            >
              <MenuItem value="all">all</MenuItem>
              <MenuItem value="info">info</MenuItem>
              <MenuItem value="warn">warn</MenuItem>
              <MenuItem value="error">error</MenuItem>
            </TextField>
          }
          columns={[
            { title: '时间', field: 'timestamp', type: 'datetime' },
            { title: '用户', field: 'message.userId', type: 'string' },
            {
              title: '用时(ms)',
              field: 'message.duration',
              type: 'string',
              cellStyle: { minWidth: 120 },
            },
            {
              title: '请求参数',
              render: rowData => <JSONViewer src={rowData['message']['request']} />,
              cellStyle: { minWidth: 200 },
            },
            {
              title: '返回结果',
              render: rowData => <JSONViewer src={rowData['message']['response']} />,
            },
          ]}
        />
      ) : (
        <WxEmpty title="请选择接口" />
      )}
    </Box>
  ) : null;
}

export default Log;
