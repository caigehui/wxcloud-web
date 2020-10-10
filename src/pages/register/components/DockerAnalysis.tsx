import WxChart from '@/components/WxChart';
import { Box, Grid, useTheme } from '@material-ui/core';
import { useRequest } from 'ahooks';
import React, { useEffect } from 'react';
import { useLocation } from 'umi';
import { buildRequest, getContainerOptions } from '../utils';

function DockerAnalysis({ period }: any) {
  const location = useLocation();
  const theme = useTheme();
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

  useEffect(() => {
    run(period);
  }, [period]);

  return (
    <Grid container spacing={2} style={{ marginBottom: theme.spacing(2) }}>
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
  );
}

function arePropsEqual(prevProps: any, nextProps: any) {
  return prevProps.period === nextProps.period;
}

export default React.memo(DockerAnalysis, arePropsEqual);
