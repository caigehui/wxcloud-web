import WxDialog from '@/components/WxDialog';
import {
  Box,
  Button,
  DialogContentText,
  FormControlLabel,
  Grid,
  TextField,
  useTheme,
  Checkbox,
  Divider,
  Switch,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { buildRequest } from '../utils';
import { useLocation } from 'umi';

interface FormData {
  name: string;
  host: string;
  routePath: string;
  path: string;
  port: number;
  retries: number;
  connect_timeout: number;
  write_timeout: number;
  read_timeout: number;
  keyAuth: boolean;
  cors: boolean;
  botDetection: boolean;
  ipWhiteList: string;
  ipBlackList: string;
  requestTemination: boolean;
  allowedPayloadSize: number;
}

export default ({ current, onClose, refresh }: any) => {
  const theme = useTheme();
  const isNew = current?.isNew;
  const location = useLocation();

  const { handleSubmit, errors, control, reset } = useForm<FormData>({
    mode: 'onChange',
  });

  useEffect(() => {
    reset(
      Object.assign({}, current, {
        host: current?.host || '',
        path: current?.path || '/',
        routePath: current?.route?.paths?.[0],
        retries: current?.retries || 5,
        connect_timeout: current?.connect_timeout || 30000,
        read_timeout: current?.read_timeout || 30000,
        write_timeout: current?.write_timeout || 30000,
        keyAuth: !!current?.plugins?.find(i => i.name === 'key-auth')?.enabled,
        cors: !!current?.plugins?.find(i => i.name === 'cors')?.enabled,
        botDetection: !!current?.plugins?.find(i => i.name === 'bot-detection')?.enabled,
        requestTemination: !!current?.plugins?.find(i => i.name === 'request-termination')?.enabled,
        allowedPayloadSize: `${current?.plugins?.find(i => i.name === 'request-size-limiting')
          ?.config.allowed_payload_size || 24}`,
        ipWhiteList: current?.plugins
          ?.find(i => i.name === 'ip-restriction')
          ?.config.allow.join(','),
        ipBlackList: current?.plugins
          ?.find(i => i.name === 'ip-restriction')
          ?.config.deny.join(','),
      }),
    );
  }, [current]);

  const submit = handleSubmit(async data => {
    await buildRequest(location.state, {
      method: 'POST',
      url: isNew ? '/WxGateway/createConfig' : '/WxGateway/updateConfig',
      data: {
        item: {
          ...data,
          id: current?.id,
          routeId: current?.route?.id,
          botDetectionPluginId: current?.plugins?.find(i => i.name === 'bot-detection')?.id,
          ipRestrictionPluginId: current?.plugins?.find(i => i.name === 'ip-restriction')?.id,
          keyAuthPluginId: current?.plugins?.find(i => i.name === 'key-auth')?.id,
          corsPluginId: current?.plugins?.find(i => i.name === 'cors')?.id,
          requestTeminationPluginId: current?.plugins?.find(i => i.name === 'request-termination')
            ?.id,
          requestSizeLimitingPluginId: current?.plugins?.find(
            i => i.name === 'request-size-limiting',
          )?.id,
        },
      },
    });
    refresh();
    onClose();
  });

  return (
    <WxDialog
      width="md"
      open={!!current}
      onClose={onClose}
      titleIcon={<Edit />}
      title={`${isNew ? '新增' : '修改'}配置`}
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
      <DialogContentText>必填配置</DialogContentText>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="name"
            as={TextField}
            margin="dense"
            control={control}
            helperText={errors?.name?.message}
            error={!!errors.name}
            rules={{
              required: { value: true, message: '请输入配置名' },
            }}
            fullWidth
            required
            label="配置名"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="host"
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.host?.message}
            error={!!errors.host}
            rules={{
              required: { value: true, message: '请输入host' },
            }}
            required
            fullWidth
            label="Host"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="port"
            margin="dense"
            as={TextField}
            type="number"
            control={control}
            helperText={errors?.port?.message}
            error={!!errors.port}
            rules={{
              required: { value: true, message: '请输入端口号' },
            }}
            fullWidth
            required
            label="端口号"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            required
            name="routePath"
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.routePath?.message}
            error={!!errors.routePath}
            rules={{
              required: { value: true, message: '请输入匹配路径' },
              pattern: { value: /^\//, message: '必须以/开头' },
            }}
            fullWidth
            label="匹配路径"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            required
            name="path"
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.path?.message}
            error={!!errors.path}
            rules={{
              required: { value: true, message: '请输入附加路径' },
              pattern: { value: /^\//, message: '必须以/开头' },
            }}
            fullWidth
            label="附加路径"
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Box my={2}>
        <Divider />
      </Box>
      <DialogContentText>可选配置</DialogContentText>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Controller
            name="retries"
            margin="dense"
            type="number"
            as={TextField}
            control={control}
            fullWidth
            label="重试次数"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name="connect_timeout"
            margin="dense"
            as={TextField}
            control={control}
            fullWidth
            label="连接超时时间(ms)"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name="read_timeout"
            margin="dense"
            as={TextField}
            control={control}
            fullWidth
            label="读取超时时间(ms)"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name="write_timeout"
            margin="dense"
            as={TextField}
            control={control}
            fullWidth
            label="写入超时时间(ms)"
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Box my={2}>
        <Divider />
      </Box>
      <DialogContentText>高级配置</DialogContentText>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Controller
            control={control}
            name="botDetection"
            render={({ onChange, value }) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={e => onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="是否开启机器人检测"
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            control={control}
            name="keyAuth"
            render={({ onChange, value }) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={e => onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="是否需要验证ApiKey"
                />
              );
            }}
          />
        </Grid>{' '}
        <Grid item xs={4}>
          <Controller
            control={control}
            name="cors"
            render={({ onChange, value }) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={e => onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="是否允许跨域"
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="ipWhiteList"
            margin="dense"
            as={TextField}
            control={control}
            fullWidth
            label="ip白名单"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="ipBlackList"
            margin="dense"
            as={TextField}
            control={control}
            fullWidth
            label="ip黑名单"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            name="allowedPayloadSize"
            margin="dense"
            type="number"
            as={TextField}
            control={control}
            fullWidth
            label="限制请求大小(mb)"
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Box my={2}>
        <Divider />
      </Box>
      <DialogContentText>其他配置</DialogContentText>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Controller
            control={control}
            name="requestTemination"
            render={({ onChange, value }) => {
              return (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={e => onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="进入维护状态"
                />
              );
            }}
          />
        </Grid>
      </Grid>
    </WxDialog>
  );
};
