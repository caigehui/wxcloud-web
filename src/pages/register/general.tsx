import React, { useState } from 'react';
import WxPage from '@/components/WxPage';
import { Box, Grid, MenuItem, Paper, TextField, Typography, useTheme } from '@material-ui/core';
import { useLocation } from 'umi';
import WxChart from '@/components/WxChart';
import { useRequest } from 'ahooks';
import { buildRequest, getGaugeOption } from './utils';
import DockerAnalysis from './components/DockerAnalysis';

const getStatusLabel = (title: string, value: number, xs?: any) => {
  return (
    <Grid
      item
      // @ts-ignore
      xs={xs || true}
      container
      alignItems="center"
      justify="center"
      direction="column"
      style={{ height: 100 }}
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

  const { data: dockerInfo } = useRequest(
    () =>
      buildRequest(
        location.state,
        {
          url: '/WxSystem/dockerInfo?',
        },
        false,
        true,
      ),
    {
      formatResult: data => data.data,
      pollingInterval: 30000,
      initialData: {},
    },
  );

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
      <Grid container spacing={2} style={{ marginBottom: theme.spacing(1) }}>
        <Grid item md={12} lg={6} style={{ overflow: 'hidden' }} component={Box} height={300}>
          <Paper style={{ height: '100%', width: '100%' }}>
            <Box p={1}>
              <Typography variant="h4" color="textPrimary" style={{ padding: 4 }}>
                网关连接
              </Typography>
              <Grid container>
                {getStatusLabel('ACTIVE', data?.gateway.connectionsActive, 3)}
                {getStatusLabel('READING', data?.gateway.connectionsReading, 3)}
                {getStatusLabel('WRITING', data?.gateway.connectionsWriting, 3)}
                {getStatusLabel('WAITING', data?.gateway.connectionsWaiting, 3)}
                {getStatusLabel('ACCEPTED', data?.gateway.connectionsAccepted, 3)}
                {getStatusLabel('HANDLED', data?.gateway.connectionsHandled, 3)}
                {getStatusLabel('TOTAL', data?.gateway.connectionsTotalRequests, 3)}
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
      </Grid>
      <Grid container component={Box} mb={2}>
        <Grid item xs={12} style={{ overflow: 'hidden' }}>
          <Paper style={{ height: '100%', width: '100%' }}>
            <Box p={1}>
              <Typography variant="h4" color="textPrimary" style={{ padding: 4 }}>
                Docker 基本信息
              </Typography>
              <Grid container alignItems="center">
                {getStatusLabel('总容器', dockerInfo?.containers)}
                {getStatusLabel('运行中容器', dockerInfo?.containerRunning)}
                {getStatusLabel('镜像', dockerInfo?.images)}
                {getStatusLabel('CPU核心', dockerInfo?.ncpu)}
                {getStatusLabel(
                  '内存容量',
                  // @ts-ignore
                  (dockerInfo?.memTotal / (1024 * 1024 * 1024)).toFixed(2) + 'GB',
                )}
                {getStatusLabel(
                  '镜像占用',
                  // @ts-ignore
                  (dockerInfo?.imagesSize / (1024 * 1024 * 1024)).toFixed(2) + 'GB',
                )}
                {getStatusLabel(
                  '容器占用',
                  // @ts-ignore
                  (dockerInfo?.containersSize / (1024 * 1024 * 1024)).toFixed(2) + 'GB',
                )}
                {getStatusLabel(
                  'volumes占用',
                  // @ts-ignore
                  (dockerInfo?.volumesSize / (1024 * 1024 * 1024)).toFixed(2) + 'GB',
                )}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <DockerAnalysis period={period} />
    </WxPage>
  );
};
