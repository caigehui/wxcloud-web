import WxDialog from '@/components/WxDialog';
import { Box, Button, DialogContentText, Grid, TextField, useTheme } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from 'umi';

interface FormData {
  email: string;
  nickname: string;
  phoneNumber: string;
}

export default ({ current, onClose, refresh }: any) => {
  const theme = useTheme();
  const location = useLocation();

  const { handleSubmit, errors, reset, control } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      nickname: '',
      phoneNumber: '',
    },
  });

  const submit = handleSubmit(async data => {
    refresh();
    onClose();
  });

  useEffect(() => {
    reset({
      email: current?.email || '',
      nickname: current?.nickname,
      phoneNumber: current?.phoneNumber,
    });
  }, [current]);

  return (
    <WxDialog
      width="md"
      open={!!current}
      onClose={onClose}
      titleIcon={<Edit />}
      title={current?.isNew ? '新增用户' : '更新用户'}
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
      <DialogContentText>基本信息</DialogContentText>
      <Grid container spacing={2}>
        <Grid item xs>
          <Controller
            name="nickname"
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.nickname?.message}
            error={!!errors.nickname}
            rules={{
              required: { value: true, message: '请输入昵称' },
            }}
            fullWidth
            required
            label="昵称"
            variant="outlined"
          />
        </Grid>
        <Grid item xs>
          <Controller
            name="phoneNumber"
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.phoneNumber?.message}
            error={!!errors.phoneNumber}
            rules={{
              required: { value: true, message: '请输入手机号码' },
              pattern: { value: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' },
            }}
            fullWidth
            required
            label="手机号码"
            variant="outlined"
          />
        </Grid>
        <Grid item xs>
          <Controller
            name="email"
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.email?.message}
            error={!!errors.email}
            rules={{
              required: { value: false, message: '请输入邮箱' },
              pattern: {
                value: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                message: '请输入正确的邮箱',
              },
            }}
            fullWidth
            label="邮箱地址"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </WxDialog>
  );
};
