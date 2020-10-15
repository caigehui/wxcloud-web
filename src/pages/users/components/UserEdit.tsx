import WxDialog from '@/components/WxDialog';
import { getMenuItemNameByKey } from '@/utils';
import requestWxApi from '@/utils/requestWxApi';
import {
  Box,
  Button,
  Checkbox,
  DialogContentText,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import validator from 'validator';
import { Delete, Edit } from '@material-ui/icons';
import request from '@wxsoft/wxboot/helpers/request';
import { useRequest } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface FormData {
  username: string;
  email: string;
  nickname: string;
  phoneNumber: string;
  sendSms: boolean;
}

export default ({ current, onClose, refresh, permissions, menu }: any) => {
  const theme = useTheme();
  const [perm, setPerm] = useState({});
  const { handleSubmit, errors, reset, control } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      nickname: '',
      phoneNumber: '',
      sendSms: false,
    },
  });

  const { run, loading } = useRequest(
    data =>
      requestWxApi((token: string) =>
        request(
          {
            url: current?.isNew ? '/WxUser/create' : '/WxUser/update',
            method: 'POST',
            data: {
              user: {
                className: '_User',
                username: data.username,
                email: data.email,
                nickname: data.nickname,
                phoneNumber: data.phoneNumber,
                id: current.objectId,
                permissions: perm,
              },
              sendSms: !!data.sendSms,
            },
          },
          token,
        ),
      ),
    { manual: true },
  );

  const submit = handleSubmit(async data => {
    await run(data);
    refresh();
    onClose();
  });

  useEffect(() => {
    reset({
      username: current?.username || '',
      email: current?.email || null,
      nickname: current?.nickname || '',
      phoneNumber: current?.phoneNumber || '',
    });
    setPerm(current?.permissions || {});
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
          <Button disabled={loading} onClick={submit} color="primary">
            确定
          </Button>
        </>
      }
    >
      <DialogContentText>基本信息</DialogContentText>
      <Grid container spacing={2}>
        <Grid item xs>
          <Controller
            name="username"
            disabled={!current?.isNew}
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.username?.message}
            error={!!errors.username}
            rules={{
              required: { value: true, message: '请输入账号' },
              pattern: {
                value: /^[a-zA-Z0-9_]{4,15}$/,
                message: '账号只允许字母、数字和"_"，长度4-15',
              },
            }}
            fullWidth
            required
            label="账号"
            variant="outlined"
          />
        </Grid>
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
              validate: data =>
                validator.isEmail(data || '') || !data ? true : '请输入正确的邮箱',
            }}
            fullWidth
            label="邮箱地址"
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Box my={2}>
        <Divider />
      </Box>
      <DialogContentText>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          权限
          <Box ml={3}>
            <Tooltip title="清除所有权限">
              <IconButton onClick={() => setPerm({})}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip title="一直拥有所有权限">
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={!!perm['*']}
                    onChange={() => {
                      if (perm['*']) {
                        const p = {};
                        for (const key in permissions) {
                          p[key] = true;
                        }
                        setPerm(p);
                      } else {
                        setPerm({ '*': true });
                      }
                    }}
                  />
                }
                label={'所有权限'}
              />
            </Tooltip>
          </Box>
        </Box>
      </DialogContentText>
      {Object.keys(permissions).map(menuKey => {
        // 勾选某个菜单的全部权限
        const allChecked = perm['*'] || perm[menuKey] === true;
        const onChange = () => {
          if (allChecked) {
            perm[menuKey] = permissions[menuKey].map(i => i[0]);
          } else {
            perm[menuKey] = true;
          }
          setPerm({ ...perm });
        };
        return (
          <Box my={1} key={menuKey} display="flex" alignItems="center">
            <Box mr={2}>
              <Typography color="textPrimary" variant="body1">
                {getMenuItemNameByKey(menuKey, menu)}
              </Typography>
            </Box>
            {permissions[menuKey]
              .sort((a, b) => a[0] - b[0])
              .map(i => {
                // 勾选特定权限
                const checked =
                  perm['*'] || perm[menuKey] === true || perm[menuKey]?.some(j => j === i[0]);

                const onChange = () => {
                  if (checked) {
                    perm[menuKey] = perm[menuKey]?.filter(j => j !== i[0]);
                  } else {
                    perm[menuKey] = [].concat(perm[menuKey], i[0]);
                  }
                  setPerm({ ...perm });
                };
                return (
                  <FormControlLabel
                    key={i[1]}
                    control={
                      <Checkbox
                        disabled={perm['*'] || perm[menuKey] === true}
                        color="primary"
                        checked={!!checked}
                        onChange={onChange}
                      />
                    }
                    label={i[1]}
                  />
                );
              })}
            <Box flex={1} />
            <Tooltip title={`一直拥有所有${getMenuItemNameByKey(menuKey, menu)}权限`}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    disabled={perm['*']}
                    checked={!!allChecked}
                    onChange={onChange}
                  />
                }
                label={`全选`}
              />
            </Tooltip>
          </Box>
        );
      })}
      {current?.isNew && (
        <>
          <Box my={2}>
            <Divider />
          </Box>
          <DialogContentText>
            <Controller
              control={control}
              name="sendSms"
              render={({ onChange, value }) => {
                return (
                  <Tooltip title="新增后会给该新用户发送一个含有账号和随机生成的密码的手机短信">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          onChange={e => onChange(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="是否发送短信"
                    />
                  </Tooltip>
                );
              }}
            />
          </DialogContentText>
        </>
      )}
    </WxDialog>
  );
};
