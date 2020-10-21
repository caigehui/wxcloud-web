import WxDialog from '@/components/WxDialog';
import { Box, Button, Grid, TextField, Typography, useTheme } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useModel } from 'umi';
import axios from 'axios';
import { GITLAB_NAMESPACE_ID, GITLAB_URL } from '@/constants';
import WxSnackBar from '@/components/WxSnackBar';

interface FormData {
  name: string;
  description: string;
}

export default ({ current, onClose, refresh }: any) => {
  const theme = useTheme();
  const isNew = current?.isNew;
  const [avatar, setAvatar] = useState(null);
  const { user } = useModel('useAuthModel');

  const { handleSubmit, errors, control, reset } = useForm<FormData>({
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      name: current?.name,
      description: current?.description,
    });
  }, [current]);

  const onFileChange = e => {
    setAvatar(e.target.files[0]);
  };

  const submit = handleSubmit(async data => {
    const formData = new FormData();
    formData.set('name', data.name);
    formData.set('description', data.description);
    avatar && formData.set('avatar', avatar);
    formData.set('namespace_id', GITLAB_NAMESPACE_ID);
    formData.set('visibility', 'private');
    try {
      await axios({
        url: GITLAB_URL + (isNew ? '/api/v4/projects' : `/api/v4/projects/${current.id}`),
        headers: {
          'content-type': 'multipart/form-data',
          'PRIVATE-TOKEN': user['gitlabToken'],
        },
        method: isNew ? 'POST' : 'PUT',
        data: formData,
      });
      refresh();
      onClose();
    } catch (error) {
      WxSnackBar.error(JSON.stringify(error.response.data.message));
    }
  });

  return (
    <WxDialog
      width="sm"
      open={!!current}
      onClose={onClose}
      titleIcon={<Edit />}
      title={`${isNew ? '新建' : '修改'}项目`}
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
            helperText={errors?.name?.message || '项目名由字母、数字和下划线组成'}
            error={!!errors.name}
            rules={{
              required: { value: true, message: '请输入项目名称' },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: '项目名由字母、数字和下划线组成',
              },
            }}
            fullWidth
            required
            label="项目名称"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="description"
            margin="dense"
            as={TextField}
            control={control}
            required
            fullWidth
            label="描述（可选）"
            variant="outlined"
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <input
              accept="image/*"
              id="contained-button-file"
              style={{ display: 'none' }}
              type="file"
              onChange={onFileChange}
              onClick={event => {
                event.target['value'] = null;
              }}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                上传项目头像
              </Button>
            </label>
            {avatar?.name && (
              <Typography
                style={{ marginLeft: theme.spacing(2) }}
                color="textPrimary"
                variant="body1"
              >
                {avatar.name}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </WxDialog>
  );
};
