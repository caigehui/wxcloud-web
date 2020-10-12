import WxDialog from '@/components/WxDialog';
import { Box, Button, Grid, MenuItem, TextField, useTheme } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { buildRequest } from '../utils';
import { useLocation } from 'umi';
import { useSocket } from 'use-socketio';
import WxConsole from '@/components/WxConsole';
import dayjs from 'dayjs';

export default ({ containerLog, onClose }: any) => {
  const theme = useTheme();
  const location = useLocation();
  const [pulling, setPulling] = useState(false);
  const consoleRef = useRef<any>();

  const { socket } = useSocket('message', data => {
    // if (data.status === 'failed') {
    //   setPulling(false);
    //   consoleRef?.current?.write(JSON.stringify(data.error));
    // } else {
    //   consoleRef?.current?.write(
    //     data.status + (data.id ? `(${data.id}): ` : '') + (data.progress || ''),
    //   );
    // }
    // if (data.status === 'finished') {
    //   setTimeout(() => {
    //     onClose();
    //     setPulling(false);
    //   }, 1000);
    // }
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await buildRequest(location.state, {
        url: '/WxMicro/containerLog',
        params: { id: containerLog.Id },
      });
      for (const line of data.split('\n')) {
        const content = line.substr(line.indexOf('20'));
        const timestamp = content.substring(0, content.indexOf(' '));
        consoleRef?.current?.writeln(
          dayjs(timestamp).format('YYYY/MM/DD HH:mm:ss') +
            ' ' +
            content.substring(content.indexOf(' ')),
        );
        consoleRef?.current?.writeln('');
      }
    };
    if (containerLog) {
      fetchData();
    } else {
      consoleRef?.current?.clear();
    }
  }, [containerLog]);

  return (
    <WxDialog
      width="md"
      open={!!containerLog}
      onClose={() => !pulling && onClose()}
      titleIcon={<Edit />}
      title={containerLog?.Name + '镜像日志'}
      actions={
        <>
          <Button disabled={pulling} onClick={onClose} color="primary">
            确定
          </Button>
        </>
      }
    >
      <Box height="700px" width="100%">
        <WxConsole ref={consoleRef} />
      </Box>
    </WxDialog>
  );
};
