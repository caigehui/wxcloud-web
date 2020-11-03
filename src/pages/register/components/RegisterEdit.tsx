import WxDialog from '@/components/WxDialog';
import { Box, Button, Chip, DialogContentText, Grid, TextField, useTheme } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { randomBytes } from 'crypto';
import validator from 'validator';
import requestWxApi from '@/utils/requestWxApi';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory, useModel } from 'umi';

interface FormData {
  code: string;
  name: string;
  url: string;
  secret: string;
  masterKey: string;
  managedBy: Object[];
}

export default ({ current, onClose, refresh, usernames }: any) => {
  const theme = useTheme();
  const isNew = current?.isNew;
  const { user } = useModel('useAuthModel');
  const history = useHistory();

  const { handleSubmit, errors, control, reset } = useForm<FormData>({
    mode: 'onChange',
  });

  const defaultManagedBy = {
    nickname: user['nickname'],
    objectId: user.id,
    __type: 'Pointer',
    className: '_User',
  };

  useEffect(() => {
    reset(
      Object.assign({}, current, {
        secret: current?.secret || randomBytes(12).toString('hex'),
        masterKey: current?.masterKey || randomBytes(12).toString('hex'),
        restApiKey: current?.restApiKey || randomBytes(12).toString('hex'),
        javascriptKey: current?.javascriptKey || randomBytes(12).toString('hex'),
        managedBy: current?.managedBy || [defaultManagedBy],
      }),
    );
  }, [current]);

  const submit = handleSubmit(async data => {
    const ret = await requestWxApi({
      method: 'POST',
      url: '/WxRegister/save',
      data: {
        item: {
          ...current,
          ...data,
          id: current?.objectId,
          className: 'WxRegister',
        },
      },
    });
    if (isNew) {
      history.push('/tutorial', ret);
    }
    refresh();
    onClose();
  });

  return (
    <WxDialog
      width="sm"
      open={!!current}
      onClose={onClose}
      titleIcon={<Edit />}
      title={`${isNew ? '注册' : '修改'}服务`}
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
        <Grid item xs={6}>
          <Controller
            name="name"
            as={TextField}
            margin="dense"
            control={control}
            helperText={errors?.name?.message}
            error={!!errors.name}
            rules={{
              required: { value: true, message: '请输入服务器名称' },
            }}
            fullWidth
            required
            label="服务器名称"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="code"
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.code?.message}
            error={!!errors.code}
            rules={{
              required: { value: true, message: '请输入服务器代号' },
            }}
            required
            fullWidth
            label="服务器代号"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            required
            name="url"
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.url?.message}
            error={!!errors.url}
            rules={{
              required: { value: true, message: '请输入url' },
              validate: data => {
                return validator.isURL(data);
              },
            }}
            fullWidth
            multiline
            rowsMax={3}
            label="url"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="secret"
            margin="dense"
            as={TextField}
            control={control}
            fullWidth
            required
            label="Secret"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="masterKey"
            margin="dense"
            as={TextField}
            control={control}
            required
            fullWidth
            label="Master Key"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="managedBy"
            rules={{
              required: { value: true, message: '请输入端口映射' },
            }}
            render={({ onChange, value }) => {
              return (
                <Autocomplete
                  multiple
                  options={usernames}
                  value={value}
                  getOptionLabel={option => option.nickname}
                  onChange={(e, newValue) => {
                    onChange([defaultManagedBy, ...newValue.filter(i => i.objectId !== user.id)]);
                  }}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={index}
                        label={option.nickname}
                        color="primary"
                        {...getTagProps({ index })}
                        disabled={option.objectId === user.id}
                      />
                    ))
                  }
                  filterSelectedOptions
                  renderInput={params => (
                    <TextField {...params} variant="outlined" margin="dense" label="管理人员" />
                  )}
                />
              );
            }}
          />
        </Grid>
      </Grid>
    </WxDialog>
  );
};
