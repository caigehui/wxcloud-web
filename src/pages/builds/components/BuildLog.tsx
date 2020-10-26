import WxDialog from '@/components/WxDialog';
import { Box, Button } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect, useRef } from 'react';
import { useSocket } from 'use-socketio';
import WxConsole from '@/components/WxConsole';

export default ({ buildLog, onClose }: any) => {
  const consoleRef = useRef<any>();

  const { socket } = useSocket('message', data => {
    if (data.type === 'failed') {
      consoleRef?.current?.writeln(JSON.stringify(data.error));
    } else if (data.type === 'init') {
      for (const msg of data.payload) {
        msg && consoleRef?.current?.writeln(msg.trim());
      }
    } else {
      const content = data.payload?.trim();
      content && consoleRef?.current?.writeln(content);
    }
  });

  const close = () => {
    onClose();
    socket.emit('stopReadBuildLogs');
  };

  useEffect(() => {
    if (buildLog) {
      socket.emit('readBuildLogs', buildLog.objectId);
    } else {
      consoleRef?.current?.clear();
    }
  }, [buildLog]);

  return (
    <WxDialog
      width="md"
      open={!!buildLog}
      onClose={close}
      titleIcon={<Edit />}
      title={`构建日志`}
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
