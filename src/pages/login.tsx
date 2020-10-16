import React, { useState, Dispatch, SetStateAction } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import { useInterval, useLocalStorageState, useRequest } from 'ahooks';
import WxLoading from '@/components/WxLoading';
import { useModel } from 'umi';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { Helmet } from 'react-helmet';
import { Hidden, Tab, Tabs, Tooltip } from '@material-ui/core';
import WxSnackBar from '@/components/WxSnackBar';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.cnwxsoft.com/">
        wxcloud
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

type FormData = {
  username: string;
  password: string;
  phoneNumber: string;
  code: string;
};

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${require('@/assets/system/default_background.jpg')})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(4, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const useManualInterval = (
  fn: any,
  interval: number | null | undefined,
  options?: { immediate?: boolean },
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [enable, setEnable] = useState<boolean>(false);
  useInterval(fn, enable ? interval : null, options);
  return [enable, setEnable];
};

export default function SignInSide() {
  const classes = useStyles();
  const { logIn, sendSmsCode } = useModel('useAuthModel');
  const [count, setCount] = useState(30);
  const [timer, setTimer] = useManualInterval(
    () => {
      setCount(count - 1);
      if (count === 1) {
        setTimer(!timer);
      }
    },
    1000,
    { immediate: false },
  );
  const {
    initialState,
  } = useModel('@@initialState');

  const [loginType, setLoginType] = useLocalStorageState('loginType', 'password');

  const { handleSubmit, control, getValues } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange',
  });

  const { loading, error, run } = useRequest(
    (func: Function, ...args) => {
      return func(...args);
    },
    { manual: true },
  );

  const submit = handleSubmit(data => {
    run(logIn, { ...data, browserId: initialState?.fingerprint }, loginType === 'sms');
  });

  const sendCode = async () => {
    const ret = await run(sendSmsCode, { phoneNumber: getValues()['phoneNumber'] });
    if (ret !== 30) {
      WxSnackBar.warning(`已经发送过短信，请于${ret}秒后重新发送。`);
    }
    setCount(ret);
    setTimer(true);
  };

  // 登录按钮是否可以点击
  const submitEnabled =
    !loading &&
    ((getValues()['username'] && getValues()['password']) ||
      (/^1[3456789]\d{9}$/.test(getValues()['phoneNumber']) && getValues()['code']?.length === 6));

  return (
    <Grid container component="main" className={classes.root}>
      <Helmet>
        <title>用户登录 - 网欣云</title>
      </Helmet>
      <CssBaseline />
      <Grid item xs sm lg={9} className={classes.image} />
      <Grid container item xs={12} sm={5} lg={3} component={Paper} elevation={6}>
        <Grid item direction="column" container>
          <Grid item xs>
            <div className={classes.paper}>
              <Hidden mdUp>
                <Box mb={1}>
                  <Logo width={64} height={64} />
                </Box>
              </Hidden>
              <Hidden mdDown>
                <Box mb={1}>
                  <Logo width={100} height={100} />
                </Box>
              </Hidden>
              <Typography color="inherit" variant="h3">
                网欣云登录
              </Typography>
              <form className={classes.form} onSubmit={submit}>
                <Box my={2}>
                  <Tabs
                    value={loginType}
                    indicatorColor="primary"
                    onChange={(e, value) => setLoginType(value)}
                    centered
                  >
                    <Tab style={{ minWidth: 120 }} label="账号密码" value="password" />
                    <Tab style={{ minWidth: 120 }} label="短信验证码" value="sms" />
                  </Tabs>
                </Box>
                {!!error && <Alert severity="error">{error?.message}</Alert>}
                {loginType === 'password' ? (
                  <>
                    <Controller
                      as={TextField}
                      control={control}
                      defaultValue=""
                      name="username"
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      label="用户名或者手机号码"
                      autoComplete="username"
                      rules={{
                        required: { value: true, message: '请输入用户名或者手机号码' },
                      }}
                    />
                    <Controller
                      as={TextField}
                      control={control}
                      defaultValue=""
                      variant="outlined"
                      margin="normal"
                      rules={{
                        required: { value: true, message: '请输入密码' },
                      }}
                      required
                      fullWidth
                      name="password"
                      label="密码"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />
                  </>
                ) : (
                  <>
                    <Controller
                      as={TextField}
                      control={control}
                      defaultValue=""
                      name="phoneNumber"
                      variant="outlined"
                      margin="normal"
                      rules={{
                        required: { value: true, message: '请输入手机号码' },
                        pattern: { value: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' },
                      }}
                      inputProps={{ maxLength: 11 }}
                      required
                      fullWidth
                      label="手机号码"
                      autoComplete="tel"
                    />
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs>
                        <Controller
                          as={TextField}
                          control={control}
                          defaultValue=""
                          name="code"
                          variant="outlined"
                          margin="normal"
                          rules={{
                            required: { value: true, message: '请输入验证码' },
                            maxLength: { value: 6, message: '请输入六位验证码' },
                            minLength: { value: 6, message: '请输入六位验证码' },
                          }}
                          required
                          fullWidth
                          label="验证码"
                          autoComplete="off"
                        />
                      </Grid>
                      <Grid item style={{ marginTop: 4 }}>
                        <Button
                          disabled={!/^1[3456789]\d{9}$/.test(getValues()['phoneNumber']) || timer}
                          color="primary"
                          variant="contained"
                          size="large"
                          onClick={sendCode}
                        >
                          {timer ? `重新发送(${count})` : '发送验证码'}
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={!submitEnabled}
                >
                  登录
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Tooltip title="忘记密码或首次登录请使用手机号验证码登录">
                      <Link variant="body2" href="#" onClick={() => setLoginType('sms')}>
                        忘记密码？
                      </Link>
                    </Tooltip>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Grid>
          <Grid item>
            <Box mb={5}>
              <Copyright />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <WxLoading loading={loading} />
    </Grid>
  );
}
