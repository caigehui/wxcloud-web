import WxDialog from '@/components/WxDialog';
import { Box, Button, Grid, TextField, useTheme } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { buildRequest } from '../utils';
import { useLocation } from 'umi';

interface FormData {
  username: string;
}

export default ({ current, onClose, refresh }: any) => {
  const theme = useTheme();
  const location = useLocation();

  const { handleSubmit, errors, control } = useForm<FormData>({
    mode: 'onChange',
  });

  const submit = handleSubmit(async data => {
    await buildRequest(location.state, {
      method: 'POST',
      url: '/WxGateway/createUser',
      data: {
        username: data.username,
      },
    });
    refresh();
    onClose();
  });

  return (
    <WxDialog
      width="sm"
      open={!!current}
      onClose={onClose}
      titleIcon={<Edit />}
      title={`新增用户`}
      actions={
        <>
          <Box color={theme.palette.text.hint}>
            <Button onClick={onClose} color="inherit">
              取消
            </Button>
          </Box>
          <Button onClick={submit} color="primary">
            确定
          </Button>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs>
          <Controller
            name="username"
            as={TextField}
            margin="dense"
            control={control}
            helperText={errors?.username?.message}
            error={!!errors.username}
            rules={{
              required: { value: true, message: '请输入用户名' },
            }}
            fullWidth
            required
            label="用户名"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </WxDialog>
  );
};
