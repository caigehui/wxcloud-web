import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import { useRequest } from 'ahooks';
import WxLoading from '@/components/WxLoading';
import { useModel } from 'umi';
import { ReactComponent as Logo } from '@/assets/logo.svg';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.cnwxsoft.com/">
        wxeap
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

type FormData = {
  username: string;
  password: string;
  rememberMe: boolean;
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
    margin: theme.spacing(8, 4),
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

  const { handleSubmit, control, register } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
  });

  const { loading, error, run } = useRequest(logIn, { manual: true });
  return (
    <Grid container component="main" className={classes.root}>
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
              <form className={classes.form} onSubmit={handleSubmit(run)}>
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
                <FormControlLabel
                  inputRef={register}
                  name="rememberMe"
                  control={<Checkbox color="primary" />}
                  label="记住我"
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
                    <Link variant="body2">忘记密码？</Link>
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
