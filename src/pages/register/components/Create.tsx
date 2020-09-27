import WxDialog from '@/components/WxDialog';
import { Box, Button, DialogContentText, Grid, TextField, useTheme } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { randomBytes } from 'crypto';
import validator from 'validator';

interface FormData {
  code: string;
  name: string;
  secret: string;
  url: string;
}

export default ({ current, onClose }: any) => {
  const theme = useTheme();
  const isNew = current?.isNew;

  const { handleSubmit, errors, control, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: Object.assign({}, current, {
      secret: current?.secret || randomBytes(32).toString('hex'),
    }),
  });

  useEffect(() => {
    reset(current);
  }, [current]);

  const submit = handleSubmit(data => {
    onClose();
    return;
  });

  return (
    <WxDialog
      width="sm"
      open={!!current}
      onClose={onClose}
      titleIcon={<Edit />}
      title={`${isNew ? '新增' : '修改'} 服务`}
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
              required: { value: true, message: '请输入单位名称' },
            }}
            fullWidth
            required
            label="单位名称"
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
              required: { value: true, message: '请输入单位代号' },
            }}
            required
            fullWidth
            label="Url"
            variant="outlined"
          />
        </Grid>

        <Grid item xs>
          <Controller
            name="secret"
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.secret?.message}
            error={!!errors.secret}
            rules={{
              required: { value: true, message: '请输入Secret' },
            }}
            required
            fullWidth
            label="Secret"
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
              validate: data => validator.isURL(data),
            }}
            fullWidth
            multiline
            rowsMax={3}
            label="url"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </WxDialog>
  );
};
