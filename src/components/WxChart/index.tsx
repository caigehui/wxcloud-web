import React, { createRef, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import echarts, { EChartOption } from 'echarts/lib/echarts';
import { Box, Paper, useTheme } from '@material-ui/core';
import { THEME } from '@/constants';
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/singleAxis');
require('echarts/lib/component/title');
require('echarts/lib/chart/gauge');

export interface WxChartProps {
  option: EChartOption;
}

function WxChart({ option }: WxChartProps) {
  const ref = createRef<HTMLDivElement>();
  const theme = useTheme();
  const [myChart, setMyChart] = useState(null);

  // option变更，setOption
  useEffect(() => {
    myChart?.setOption(option);
  }, [option]);

  // 主题变更，重新初始化
  useEffect(() => {
    myChart && echarts.dispose(myChart);
    const chart = echarts.init(
      ref.current,
      theme['name'] === THEME.LIGHT
        ? require('@/assets/chart_light.json')
        : require('@/assets/chart_dark.json'),
    );
    chart?.setOption(option);
    setMyChart(chart);
  }, [theme]);

  return (
    <Paper style={{ height: '100%', width: '100%' }}>
      <Box p={1} height="100%" width="100%">
        <div style={{ height: '100%', width: '100%' }} ref={ref} />
      </Box>
    </Paper>
  );
}

function arePropsEqual(prevProps: WxChartProps, nextProps: WxChartProps) {
  return isEqual(prevProps.option, nextProps.option);
}

export default React.memo(WxChart, arePropsEqual);
