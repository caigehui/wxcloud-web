import WxDialog from '@/components/WxDialog';
import { Box, Button } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect, useRef } from 'react';
import { useSocket } from 'use-socketio';
import WxConsole from '@/components/WxConsole';
import dayjs from 'dayjs';

export default ({ containerLog, onClose }: any) => {
  const consoleRef = useRef<any>();

  const { socket } = useSocket('message', data => {
    if (data.type === 'err') {
      consoleRef?.current?.write(JSON.stringify(data.error));
    } else {
      const content = data.payload;
      const timestamp = content.substring(0, content.indexOf(' '));
      consoleRef?.current?.writeln(
        (dayjs(timestamp).isValid() ? dayjs(timestamp).format('YYYY/MM/DD HH:mm:ss') : '') +
          ' ' +
          content.substring(content.indexOf(' ')),
      );
    }
  });

  const close = () => {
    onClose();
    socket.send({ type: 'stopReadLogs' });
  };

  useEffect(() => {
    if (containerLog) {
      socket.send({ type: 'readLogs', payload: containerLog.Id });
    } else {
      consoleRef?.current?.clear();
    }
  }, [containerLog]);

  return (
    <WxDialog
      width="md"
      open={!!containerLog}
      onClose={close}
      titleIcon={<Edit />}
      title={containerLog?.Name + '镜像日志'}
      actions={
        <>
          <Button onClick={close} color="primary">
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
