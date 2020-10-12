import WxDialog from '@/components/WxDialog';
import { Box, Button, Grid, MenuItem, TextField, useTheme } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { buildRequest } from '../utils';
import { useLocation } from 'umi';
import { useSocket } from 'use-socketio';
import WxConsole from '@/components/WxConsole';

interface FormData {
  repoTag: string;
  from: string;
}

export default ({ current, onClose, refresh }: any) => {
  const theme = useTheme();
  const location = useLocation();
  const [pulling, setPulling] = useState(false);
  const consoleRef = useRef<any>();

  const { socket } = useSocket('message', data => {
    if (data.status === 'failed') {
      setPulling(false);
      consoleRef?.current?.writeln(JSON.stringify(data.error));
    } else {
      consoleRef?.current?.writeln(
        data.status + (data.id ? `(${data.id}): ` : '') + (data.progress || ''),
      );
    }

    if (data.status === 'finished') {
      setTimeout(() => {
        onClose();
        refresh();
        setPulling(false);
      }, 1000);
    }
  });

  const { handleSubmit, errors, control, reset } = useForm<FormData>({
    mode: 'onChange',
  });

  const submit = handleSubmit(async data => {
    setPulling(true);
    await buildRequest(location.state, {
      method: 'POST',
      url: '/WxImage/create',
      data: data,
    });
    socket.send('pullImage');
    consoleRef?.current?.write('start pulling image...');
  });

  useEffect(() => {
    if (current && !current.isNew) {
      reset({
        repoTag: current.RepoTags[0],
        from: current.RepoTags[0].indexOf('/') > 0 ? '网欣云' : 'Docker Hub',
      });
      setTimeout(() => {
        submit();
      }, 500);
    } else {
      reset({
        from: 'Docker Hub',
      });
    }
  }, [current]);

  return (
    <WxDialog
      width="sm"
      open={!!current}
      onClose={() => !pulling && onClose()}
      titleIcon={<Edit />}
      title={`拉取镜像`}
      actions={
        <>
          <Box color={theme.palette.text.hint}>
            <Button disabled={pulling} onClick={onClose} color="inherit">
              取消
            </Button>
          </Box>
          <Button disabled={pulling} onClick={submit} color="primary">
            确定
          </Button>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="from"
            as={TextField}
            select
            margin="dense"
            control={control}
            fullWidth
            required
            label="镜像源"
            disabled={pulling}
            variant="outlined"
          >
            <MenuItem value="Docker Hub">Docker Hub</MenuItem>
            <MenuItem value="网欣云">网欣云</MenuItem>
          </Controller>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="repoTag"
            as={TextField}
            margin="dense"
            control={control}
            disabled={pulling}
            helperText={errors?.repoTag?.message}
            error={!!errors.repoTag}
            rules={{
              required: { value: true, message: '请输入镜像Tag' },
            }}
            fullWidth
            required
            label="镜像Tag"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Box height="500" width="100%">
            <WxConsole ref={consoleRef} initMessage="waiting for pull image" />
          </Box>
        </Grid>
      </Grid>
    </WxDialog>
  );
};
