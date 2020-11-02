import requestWxApi from '@/utils/requestWxApi';
import { Box, Paper, Switch, Typography } from '@material-ui/core';

import { useRequest } from 'ahooks';
import React from 'react';
import { useModel } from 'umi';

export default () => {
  const { initialState } = useModel('@@initialState');

  const { data: isSafe, refresh } = useRequest(() =>
    requestWxApi({
      url: '/WxUser/browserSafe',
      params: {
        browserId: initialState?.fingerprint,
      },
    }),
  );

  const { run, loading } = useRequest(
    checked =>
      requestWxApi({
        url: '/WxUser/setBrowserSafe',
        method: 'POST',
        data: {
          browserId: initialState?.fingerprint,
          safe: checked,
        },
      }),
    { manual: true },
  );

  return (
    <Box mt={2}>
      <Paper>
        <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
          <Typography color="textPrimary" variant="body1">
            信任该浏览器
          </Typography>
          <Switch
            color="primary"
            checked={!!isSafe}
            disabled={loading}
            onChange={async (e, checked) => {
              await run(checked);
              refresh();
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};
