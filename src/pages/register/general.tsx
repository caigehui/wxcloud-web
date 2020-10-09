import React, { useState } from 'react';
import WxPage from '@/components/WxPage';
import { Box, Grid, MenuItem, Paper, TextField, Typography, useTheme } from '@material-ui/core';
import { useLocation } from 'umi';
import WxChart from '@/components/WxChart';
import { useMount, useRequest } from 'ahooks';
import { buildRequest, getContainerOptions, getGaugeOption } from './utils';

const getGatewayStatus = (title: string, value: number) => {
  return (
    <Grid
      item
      xs={3}
      container
      alignItems="center"
      direction="column"
      style={{ marginTop: 16, height: 100 }}
    >
      <Typography style={{ fontWeight: 'bold' }} variant="h5" color="textSecondary">
        {title}
      </Typography>
      <Box mt={1}>
        <Typography style={{ fontWeight: 'bold' }} variant="h3" color="textPrimary">
          {value > 1000 ? (value / 1000).toFixed(0) + 'K+' : value}
        </Typography>
      </Box>
    </Grid>
  );
};

export default ({ menu }) => {
  const location = useLocation();
  const theme = useTheme();
  const [period, setPeriod] = useState('20m');

  const { data } = useRequest(
    () =>
      buildRequest(
        location.state,
        {
          url: '/WxSystem/current',
        },
        false,
        true,
      ),
    {
      formatResult: data => data.data,
      pollingInterval: 5000,
    },
  );

  const { data: containers, run } = useRequest(
    (p?: string) =>
      buildRequest(
        location.state,
        {
          url: '/WxSystem/containers',
          params: {
            level: p || period,
          },
        },
        false,
        true,
      ),
    {
      manual: true,
      formatResult: data => data.data,
      pollingInterval: 10000,
    },
  );

  useMount(() => {
    run();
  });

  return (
    <WxPage
      menu={menu}
      renderRight={
        <TextField
          select
          label="展示周期"
          style={{ width: 100 }}
          value={period}
          onChange={e => {
            setPeriod(e.target.value);
            run(e.target.value);
          }}
          variant="outlined"
          margin="dense"
        >
          <MenuItem value="20m">20m</MenuItem>
          <MenuItem value="2h">2h</MenuItem>
          <MenuItem value="12h">12h</MenuItem>
          <MenuItem value="24h">24h</MenuItem>
        </TextField>
      }
    >
      <Grid container spacing={2} style={{ marginBottom: theme.spacing(2) }}>
        <Grid item md={12} lg={6} style={{ overflow: 'hidden' }} component={Box} height={300}>
          <Paper style={{ height: '100%', width: '100%' }}>
            <Box p={1}>
              <Typography variant="h4" color="textPrimary" style={{ padding: 4 }}>
                网关连接
              </Typography>
              <Grid container>
                {getGatewayStatus('ACTIVE', data?.gateway.connectionsActive)}
                {getGatewayStatus('READING', data?.gateway.connectionsReading)}
                {getGatewayStatus('WRITING', data?.gateway.connectionsWriting)}
                {getGatewayStatus('WAITING', data?.gateway.connectionsWaiting)}
                {getGatewayStatus('ACCEPTED', data?.gateway.connectionsAccepted)}
                {getGatewayStatus('HANDLED', data?.gateway.connectionsHandled)}
                {getGatewayStatus('TOTAL', data?.gateway.connectionsTotalRequests)}
              </Grid>
            </Box>
          </Paper>
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
            title="CPU使用"
            option={getGaugeOption(theme, 'CPU', '使用率', data?.cpu?.currentLoad?.toFixed(2))}
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
            title="内存使用"
            option={getGaugeOption(
              theme,
              '内存使用',
              `${(data?.memory?.used / (1024 * 1024 * 1024)).toFixed(1)}/${(
                data?.memory?.total /
                (1024 * 1024 * 1024)
              ).toFixed(1)}GB`,
              ((data?.memory?.used * 100) / data?.memory?.total).toFixed(2),
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ overflow: 'hidden' }} component={Box} height={400}>
          <WxChart
            title="Docker CPU使用"
            option={getContainerOptions(containers, 'cpu', value => value.toFixed(2), '%')}
          />
        </Grid>
        <Grid item xs={12} style={{ overflow: 'hidden' }} component={Box} height={400}>
          <WxChart
            title="Docker 内存使用"
            option={getContainerOptions(
              containers,
              'memory',
              value => (value / (1024 * 1024)).toFixed(2),
              'MB',
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ overflow: 'hidden' }} component={Box} height={400}>
          <WxChart
            title="Docker 接收数据量"
            option={getContainerOptions(
              containers,
              'netIO.rx',
              value => (value / (1024 * 1024)).toFixed(2),
              'MB',
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ overflow: 'hidden' }} component={Box} height={400}>
          <WxChart
            title="Docker 发送数据量"
            option={getContainerOptions(
              containers,
              'netIO.tx',
              value => (value / (1024 * 1024)).toFixed(2),
              'MB',
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ overflow: 'hidden' }} component={Box} height={400}>
          <WxChart
            title="Docker 存储写入量"
            option={getContainerOptions(
              containers,
              'blockIO.w',
              value => (value / (1024 * 1024)).toFixed(2),
              'MB',
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ overflow: 'hidden' }} component={Box} height={400}>
          <WxChart
            title="Docker 存储读取量"
            option={getContainerOptions(
              containers,
              'blockIO.r',
              value => (value / (1024 * 1024)).toFixed(2),
              'MB',
            )}
          />
        </Grid>
      </Grid>
    </WxPage>
  );
};
