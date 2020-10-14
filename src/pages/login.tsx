import React from 'react';
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
import { useLocalStorageState, useRequest } from 'ahooks';
import WxLoading from '@/components/WxLoading';
import { useModel } from 'umi';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { Helmet } from 'react-helmet';
import { Tab, Tabs, Tooltip } from '@material-ui/core';
import { getReCaptchaToken } from '@/utils';

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

export default function SignInSide() {
  const classes = useStyles();
  const { logIn } = useModel('useAuthModel');
  const {
    initialState: { fingerprint },
  } = useModel('@@initialState');

  const [loginType, setLoginType] = useLocalStorageState('loginType', 'password');

  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange',
  });

  const { loading, error, run } = useRequest(logIn, { manual: true });

  const submit = handleSubmit(async data => {
    const reCaptchaToken = await getReCaptchaToken();
    run({ ...data, reCaptchaToken, browserId: fingerprint });
  });

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
              <Box mb={1}>
                <Logo width={100} height={100} />
              </Box>
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
                <Controller
                  as={TextField}
                  control={control}
                  defaultValue=""
                  name="username"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="用户名或者手机号码"
                  autoComplete="username"
                />
                <Controller
                  as={TextField}
                  control={control}
                  defaultValue=""
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="密码"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  登录
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Tooltip title="使用手机号验证码登录">
                      <Link variant="body2" href="javascript:;" onClick={() => setLoginType('sms')}>
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
