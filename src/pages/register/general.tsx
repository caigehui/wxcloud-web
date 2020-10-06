import React, { useState } from 'react';
import WxPage from '@/components/WxPage';
import { Box, Grid, Paper, Typography, useTheme } from '@material-ui/core';
import { useLocation } from 'umi';
import WxChart from '@/components/WxChart';
import { useRequest } from 'ahooks';
import { buildRequest, getGaugeOption } from './utils';

export default ({ menu }) => {
  const location = useLocation();
  const theme = useTheme();
  const { data } = useRequest(
    () =>
      buildRequest(
        location.state,
        {
          url: '/WxSystem/currentLoad',
        },
        false,
        true,
      ),
    {
      formatResult: data => data.data,
      pollingInterval: 1000,
    },
  );

  return (
    <WxPage menu={menu}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          style={{ overflow: 'hidden' }}
          component={Box}
          height={300}
        >
          <WxChart
            option={getGaugeOption(theme, 'CPU利用率', data?.cpu?.currentload?.toFixed(2))}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          style={{ overflow: 'hidden' }}
          component={Box}
          height={300}
        >
          <WxChart
            option={getGaugeOption(theme, '内存占用', data?.memory?.currentload?.toFixed(2))}
          />
        </Grid>
      </Grid>
    </WxPage>
  );
};
