import WxDialog from '@/components/WxDialog';
import { Box, Button, Grid, MenuItem, TextField, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Edit } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { buildRequest } from '../utils';
import { useLocation } from 'umi';

interface FormData {
  name: string;
  image: string;
  ports: string[];
  network: string;
  restart: string;
  env: string[];
  binds: string[];
}

export default ({ current, onClose, refresh, networkOptions, localImages }: any) => {
  const theme = useTheme();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const { handleSubmit, errors, reset, control } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      image: '',
      ports: [],
      network: '',
      restart: 'default',
      env: [],
      binds: [],
    },
  });

  const submit = handleSubmit(async data => {
    setLoading(true);
    await buildRequest(location.state, {
      method: 'POST',
      url: '/WxMicro/create',
      data: {
        id: current?.Id,
        ...data,
        restart: data.restart === 'default' ? '' : data.restart,
      },
    });
    setLoading(false);
    refresh();
    onClose();
  });

  useEffect(() => {
    if (current && !current.isNew) {
      const getDetail = async () => {
        setLoading(true);
        const { data } = await buildRequest(location.state, {
          url: '/WxMicro/inspect',
          params: {
            id: current?.Id,
          },
        });
        reset({
          name: data.Name.replace('/', ''),
          image: data.Config.Image,
          ports: current.Ports.filter(i => i.PublicPort).map(
            i => i.PrivatePort + ':' + i.PublicPort,
          ),
          network: Object.keys(current.NetworkSettings.Networks)?.[0],
          env: data.Config.Env,
          binds: data.Mounts?.map(i => `${i.Source}:${i.Destination}`),
          restart: data.HostConfig.RestartPolicy.Name,
        });
        setLoading(false);
      };

      getDetail();
    } else {
      reset();
    }
  }, [current]);

  return (
    <WxDialog
      width="sm"
      open={!!current}
      onClose={() => !loading && onClose()}
      titleIcon={<Edit />}
      title={current?.isNew ? '创建容器' : '更新容器'}
      actions={
        <>
          <Box color={theme.palette.text.hint}>
            <Button disabled={loading} onClick={onClose} color="inherit">
              取消
            </Button>
          </Box>
          <Button disabled={loading} onClick={submit} color="primary">
            确定
          </Button>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="name"
            as={TextField}
            margin="dense"
            control={control}
            helperText={errors?.name?.message || '备注：Docker会对容器名进行DNS解析，所以容器名也是该容器的Host，如无特殊需要，请与镜像名保持一致'}
            error={!!errors.name}
            rules={{
              required: { value: true, message: '请输入容器名' },
            }}
            fullWidth
            required
            label="容器名"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="image"
            rules={{
              required: { value: true, message: '请输入镜像Tag' },
            }}
            render={({ onChange, value }) => {
              return (
                <Autocomplete
                  options={localImages}
                  value={value}
                  onChange={(e, newValue) => {
                    onChange(newValue);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      required
                      helperText={errors?.image?.message}
                      error={!!errors.image}
                      variant="outlined"
                      margin="dense"
                      label="镜像Tag"
                    />
                  )}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="network"
            rules={{
              required: { value: true, message: '请选择网络' },
            }}
            render={({ onChange, value }) => {
              return (
                <Autocomplete
                  options={networkOptions}
                  value={value}
                  onChange={(e, newValue) => {
                    onChange(newValue);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      required
                      helperText={errors?.network?.message}
                      error={!!errors.network}
                      variant="outlined"
                      margin="dense"
                      label="网络"
                    />
                  )}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="ports"
            rules={{
              required: { value: true, message: '请输入端口映射' },
            }}
            render={({ onChange, value }) => {
              return (
                <Autocomplete
                  multiple
                  options={[]}
                  value={value}
                  onChange={(e, newValue) => {
                    onChange(newValue);
                  }}
                  freeSolo
                  filterSelectedOptions
                  ChipProps={{ color: 'primary' }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      helperText={
                        // @ts-ignore
                        errors?.ports?.message || 'eg: 1337:1337，按Enter加入选择'
                      }
                      error={!!errors.ports}
                      variant="outlined"
                      margin="dense"
                      label="端口映射"
                    />
                  )}
                />
              );
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            control={control}
            name="env"
            render={({ onChange, value }) => {
              return (
                <Autocomplete
                  multiple
                  options={[]}
                  value={value}
                  onChange={(e, newValue) => {
                    onChange(newValue);
                  }}
                  freeSolo
                  filterSelectedOptions
                  ChipProps={{ color: 'primary' }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      label="Env"
                      helperText="eg: USER_NAME=admin，按Enter加入选择"
                    />
                  )}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="binds"
            render={({ onChange, value }) => {
              return (
                <Autocomplete
                  multiple
                  options={[]}
                  value={value}
                  onChange={(e, newValue) => {
                    onChange(newValue);
                  }}
                  freeSolo
                  filterSelectedOptions
                  ChipProps={{ color: 'primary' }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      margin="dense"
                      label="Volumes映射"
                      helperText="eg: /home/data:/data，按Enter加入选择"
                    />
                  )}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="restart"
            as={TextField}
            select
            margin="dense"
            control={control}
            fullWidth
            label="重启策略"
            variant="outlined"
          >
            <MenuItem value="default">不重启</MenuItem>
            <MenuItem value="always">总是重启</MenuItem>
            <MenuItem value="unless-stopped">总是重启除非用户手动暂停</MenuItem>
            <MenuItem value="on-failure">失败时重启</MenuItem>
          </Controller>
        </Grid>
      </Grid>
    </WxDialog>
  );
};
