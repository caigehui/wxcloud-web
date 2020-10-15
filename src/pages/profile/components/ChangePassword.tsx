import WxSnackBar from '@/components/WxSnackBar';
import requestWxApi from '@/utils/requestWxApi';
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import request from '@wxsoft/wxboot/helpers/request';
import { useRequest } from 'ahooks';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AES } from 'crypto-js';
import { history } from 'umi';

interface FormData {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmed: string;
}

interface FormData {
  username: string;
}

export default () => {
  const theme = useTheme();
  const { run, loading } = useRequest(
    data =>
      requestWxApi((token: string) =>
        request(
          {
            url: '/WxUser/changePassword',
            method: 'POST',
            data: {
              oldPassword: AES.encrypt(data.oldPassword, process.env.RECAPTCHAT_KEY).toString(),
              newPassword: AES.encrypt(data.newPassword, process.env.RECAPTCHAT_KEY).toString(),
            },
          },
          token,
        ),
      ),
    { manual: true },
  );

  const { handleSubmit, errors, setError, control, reset, getValues } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmed: '',
    },
  });

  const submit = handleSubmit(async data => {
    try {
      await run(data);
      reset();
      WxSnackBar.success('更换密码成功，请重新登录！');
      history.push('/logout');
    } catch (error) {
      setError('oldPassword', error);
    }
  });

  return (
    <form onSubmit={submit}>
      <Paper style={{ marginTop: theme.spacing(2) }}>
        <Box p={2}>
          <Typography color="textPrimary" variant="body1">
            修改密码
          </Typography>
        </Box>
        <Divider />
        <Box p={2}>
          <Grid container spacing={2} component={Box} p={1}>
            <Grid item xs>
              <Controller
                name="oldPassword"
                as={TextField}
                control={control}
                helperText={errors?.oldPassword?.message}
                error={!!errors.oldPassword}
                rules={{
                  required: { value: true, message: '请输入原密码' },
                }}
                type="password"
                fullWidth
                required
                label="原密码"
                variant="outlined"
              />
            </Grid>
            <Grid item xs>
              <Controller
                name="newPassword"
                as={TextField}
                control={control}
                helperText={errors?.newPassword?.message}
                error={!!errors.newPassword}
                rules={{
                  required: { value: true, message: '请输入新密码' },
                  pattern: {
                    value: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'),
                    message: '密码强度不够',
                  },
                  validate: value => {
                    return value === getValues()['oldPassword'] ? '新密码不能跟原密码相同' : true;
                  },
                }}
                type="password"
                fullWidth
                required
                label="新密码"
                variant="outlined"
              />
            </Grid>
            <Grid item xs>
              <Controller
                name="newPasswordConfirmed"
                as={TextField}
                control={control}
                helperText={errors?.newPasswordConfirmed?.message}
                error={!!errors.newPasswordConfirmed}
                rules={{
                  required: { value: true, message: '请再次输入新密码' },
                  validate: value => {
                    return value !== getValues()['newPassword'] ? '两次密码输入不一致' : true;
                  },
                }}
                fullWidth
                type="password"
                required
                label="新密码确认"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            新密码必须同时含有大小写英文和数字，并且长度大于8个字符
          </Typography>
          <Button type="submit" disabled={loading} variant="contained" color="primary">
            修改密码
          </Button>
        </Box>
      </Paper>
    </form>
  );
};
