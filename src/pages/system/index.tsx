import WxPage from '@/components/WxPage';
import requestWxApi from '@/utils/requestWxApi';
import { Box, Button, Link, Switch, TextField, Typography } from '@material-ui/core';
import request from '@wxsoft/wxboot/helpers/request';
import { useRequest } from 'ahooks';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface FormData {
  enableSms: boolean;
  smsExpiredTime: number;
  enableReCaptcha: boolean;
  enableBrowserSms: boolean;
  whiteBrowserSessionExpiredTime: number;
  blackBrowserSessionExpiredTime: number;
}

const LEFT_WIDTH = 80;

const SwithItem = ({ name, control, title, subtitle, disabled }: any) => {
  return (
    <Box mt={3} display="flex" alignItems="center">
      <Box width={LEFT_WIDTH}>
        <Controller
          disabled={disabled}
          control={control}
          name={name}
          render={({ onChange, value }) => {
            return (
              <Switch
                checked={value}
                disabled={disabled}
                onChange={e => onChange(e.target.checked)}
                color="primary"
              />
            );
          }}
          color="primary"
        />
      </Box>
      <Box ml={2}>
        <Typography variant="body1" color="textPrimary">
          {title}
        </Typography>
        <Box mt={0.5}>
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const NumItem = ({ control, errors, name, title, label, disabled }: any) => {
  return (
    <Box mt={3} display="flex" alignItems="center">
      <Controller
        control={control}
        name={name}
        type="number"
        label={label}
        variant="outlined"
        margin="dense"
        as={TextField}
        error={errors?.[name]}
        helperText={errors?.[name]?.message}
        rules={{ min: 1 }}
        style={{ width: LEFT_WIDTH }}
        color="primary"
        disabled={disabled}
      />
      <Box ml={2} mt={0.5}>
        <Typography variant="body1" color="textPrimary">
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default ({ menu }: any) => {
  const { control, reset, errors, handleSubmit } = useForm<FormData>({
    defaultValues: {
      enableSms: true,
      smsExpiredTime: 10,
      enableReCaptcha: false,
      enableBrowserSms: true,
      whiteBrowserSessionExpiredTime: 7,
      blackBrowserSessionExpiredTime: 1,
    },
  });

  const { data } = useRequest(() =>
    requestWxApi(token => request({ url: '/WxCommon/getSystemConfig' }, token)),
  );

  useEffect(() => {
    reset(data);
  }, [data]);

  const { loading, run } = useRequest(
    data =>
      requestWxApi(token =>
        request(
          { url: '/WxCommon/saveSystemConfig', method: 'POST', data: { config: data } },
          token,
        ),
      ),
    { manual: true },
  );

  const submit = handleSubmit(run);

  return (
    <WxPage menu={menu} title="系统设置">
      <form onSubmit={submit}>
        <Box mt={2}>
          <Typography variant="h4" color="textPrimary">
            短信
          </Typography>
        </Box>
        <SwithItem
          control={control}
          name="enableSms"
          title="是否启用短信"
          subtitle="短信功能包括登录验证码，登录提醒和重置密码"
        />
        <NumItem
          errors={errors}
          title="短信失效时间"
          control={control}
          name="smsExpiredTime"
          label="分钟"
        />
        <Box mt={6}>
          <Typography variant="h4" color="textPrimary">
            安全
          </Typography>
        </Box>
        <SwithItem
          control={control}
          name="enableReCaptcha"
          title="是否启用reCAPTCHA"
          subtitle={
            <>
              使用
              <Link href="https://www.google.com/recaptcha/about/" target="_blank">
                reCAPTCHA作为
              </Link>
              验证码服务
            </>
          }
        />
        <SwithItem
          control={control}
          name="enableBrowserSms"
          title="是否启用登录短信提醒"
          subtitle="在新的浏览器（或设备）登录时会发送短信提醒到账号绑定的手机号中"
        />
        <NumItem
          errors={errors}
          title="受信任会话有效时间"
          control={control}
          name="whiteBrowserSessionExpiredTime"
          label="天"
        />
        <NumItem
          errors={errors}
          title="非信任会话有效时间"
          control={control}
          name="blackBrowserSessionExpiredTime"
          label="小时"
        />

        <Box mt={4}>
          <Button disabled={loading} type="submit" color="primary" variant="contained">
            保存
          </Button>
        </Box>
      </form>
    </WxPage>
  );
};
