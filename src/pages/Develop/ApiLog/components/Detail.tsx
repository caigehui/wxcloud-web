import React, { useState } from 'react';
import { makeStyles, Tabs, Tab, Box, Paper } from '@material-ui/core';
import Test from './Test';
import Log from './Log';
import WxEmpty from '@/components/WxEmpty';

interface DetailProps {
  current: any;
}

function Detail({ current }: DetailProps) {
  const styles = useStyles();
  const [tab, setTab] = useState('Log');

  return current ? (
    <Box className={styles.container}>
      <Paper className={styles.paper}>
        <Tabs textColor="primary" value={tab} onChange={(e, value) => setTab(value)}>
          <Tab label="日志" value="Log" />
          <Tab label="测试" value="Test" />
        </Tabs>
      </Paper>
      <Box overflow="auto" height="100%" p={2} pb={8}>
        <Log tab={tab} current={current} />
        <Test tab={tab} current={current} />
      </Box>
    </Box>
  ) : (
    <WxEmpty title="请先选择Controller" />
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    width: '100%',
  },
  bar: {
    backgroundColor: theme.palette.background['bar'],
    cursor: 'col-resize',
  },
  paper: {
    background: theme.palette.background.paper,
    overflowY: 'auto',
  },
}));

export default Detail;
