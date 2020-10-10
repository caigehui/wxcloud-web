import WxDialog from '@/components/WxDialog';
import { Box, Button, Grid, MenuItem, TextField, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Edit } from '@material-ui/icons';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { buildRequest } from '../utils';
import { useLocation } from 'umi';

interface FormData {
  name: string;
  image: string;
  ports: string[];
  network: string;
  restart: string;
  cmd: string[];
  binds: string[];
}

export default ({ current, onClose, refresh, networkOptions }: any) => {
  const theme = useTheme();
  const location = useLocation();

  const { handleSubmit, errors, control } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      restart: 'default',
    },
  });

  const submit = handleSubmit(async data => {
    await buildRequest(location.state, {
      method: 'POST',
      url: '/WxMicro/create',
      data: {
        ...data,
        restart: data.restart === 'default' ? '' : data.restart,
      },
    });
    refresh();
    onClose();
  });

  console.log(errors?.ports);

  return (
    <WxDialog
      width="sm"
      open={!!current}
      onClose={onClose}
      titleIcon={<Edit />}
      title={`新增容器`}
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
        <Grid item xs={12}>
          <Controller
            name="name"
            as={TextField}
            margin="dense"
            control={control}
            helperText={errors?.name?.message}
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
            name="image"
            as={TextField}
            margin="dense"
            control={control}
            helperText={errors?.image?.message}
            error={!!errors.image}
            rules={{
              required: { value: true, message: '请输入镜像名' },
            }}
            fullWidth
            required
            label="镜像名"
            variant="outlined"
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
            name="cmd"
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
                      label="Cmd"
                      helperText="eg: /bin/bash，按Enter加入选择"
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
