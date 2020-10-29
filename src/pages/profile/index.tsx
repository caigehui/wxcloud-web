import WxPage from '@/components/WxPage';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, { createRef, useEffect } from 'react';
import ChangePassword from './components/ChangePassword';
import { Helmet } from 'react-helmet';
import { useModel } from 'umi';
import Parse from '@wxsoft/parse';
import request, { serverURL } from '@wxsoft/wxboot/helpers/request';
import requestWxApi from '@/utils/requestWxApi';
import { Controller, useForm } from 'react-hook-form';
import BrowserSafe from './components/BrowserSafe';

Parse.initialize(process.env.APP_ID);
Parse.serverURL = serverURL;

interface FormData {
  email: string;
  nickname: string;
  phoneNumber: string;
}

export default () => {
  // const { handleSubmit, errors, control } = useForm<FormData>({
  //   mode: 'onChange',
  // });
  const uploadRef = createRef<HTMLInputElement>();
  const theme = useTheme();

  const { user, getCurrentUser } = useModel('useAuthModel');

  const { handleSubmit, errors, reset, control } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      nickname: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    reset({
      // @ts-ignore
      email: user.email || '',
      nickname: user['nickname'],
      phoneNumber: user['phoneNumber'],
    });
  }, [user]);

  const changeInfo = handleSubmit(async data => {
    await requestWxApi((token: string) =>
      request(
        {
          url: '/WxUser/changeInfo',
          method: 'POST',
          data: { ...data, email: data.email },
        },
        token,
      ),
    );
    await getCurrentUser();
  });

  const changeAvatar = async () => {
    const file = uploadRef.current.files?.[0];
    if (!file) return;
    const name = file?.name;
    const avatar = new Parse.File(name, file);
    const savedFile = await avatar.save();

    const ret = await requestWxApi((token: string) =>
      request(
        {
          url: '/WxUser/changeAvatar',
          method: 'POST',
          data: {
            file: savedFile,
          },
        },
        token,
      ),
    );
    await getCurrentUser();
  };

  return (
    <WxPage title="个人设置">
      <Helmet>
        <title>个人设置 - 网欣云</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <form onSubmit={changeInfo}>
            <Paper>
              <Box p={2}>
                <Typography color="textPrimary" variant="body1">
                  账号信息
                </Typography>
              </Box>
              <Divider />
              <Box p={2}>
                <Grid container spacing={2}>
                  <Grid item xs>
                    <Controller
                      name="nickname"
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
              </Box>
              <Divider />
              <Box p={2} display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">
                  保存设置
                </Button>
              </Box>
            </Paper>
          </form>
          <ChangePassword />
        </Grid>

        <Grid item xs={2}>
          <Paper>
            <Box p={2}>
              <Typography color="textPrimary" variant="body1">
                个人头像
              </Typography>
            </Box>
            <Divider />
            <Box p={2} display="flex" alignItems="center" justifyContent="space-around">
              <Avatar
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: theme.palette.background['dark'],
                  padding: theme.spacing(1),
                }}
                src={user?.['avatar']?.url}
              />
              <input
                ref={uploadRef}
                accept="image/*"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
                onChange={changeAvatar}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  更换头像
                </Button>
              </label>
            </Box>
          </Paper>
          <BrowserSafe />
        </Grid>
      </Grid>
    </WxPage>
  );
};
