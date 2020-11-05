import {
  Box,
  Button,
  DialogContentText,
  makeStyles,
  SvgIcon,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { File, GitBranch } from 'react-feather';
import clsx from 'clsx';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as Docker } from '@/assets/docker.svg';
import { Container, Section, Bar } from 'react-simple-resizer';
import FileExplorer from './components/FileExplorer';
import Crypto from 'crypto-js';
import LightningFS from '@isomorphic-git/lightning-fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import WxLoading from '@/components/WxLoading';
import wxConfirm from '@/components/WxConfirm';
import { useModel } from 'umi';
import WxSnackBar from '@/components/WxSnackBar';
import { Error } from '@material-ui/icons';
import requestWxApi from '@/utils/requestWxApi';
const fs = new LightningFS('fs');

const useStyles = makeStyles(theme => ({
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    transition: '.3s all',
    cursor: 'pointer',
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.secondary,
    '&:hover': {
      background: theme.palette.action.hover,
    },
    marginBottom: theme.spacing(1),
  },
  menuItemActived: {
    background: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
  menuIcon: {
    width: 28,
    height: 28,
  },
}));

export default ({ location }) => {
  const styles = useStyles();
  const theme = useTheme();
  const name = location.pathname.replace('/code/', '');
  const [activedIndex, setActivedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [ready, setReady] = useState(false);
  const { user } = useModel('useAuthModel');

  useEffect(() => {
    async function clone() {
      setLoading(true);
      try {
        await git.clone({
          fs,
          http,
          dir: `/${name}`,
          corsProxy: process.env.PROXY_TARGET + '/cors',
          url: `https://gitlab.wxsoft.cn/wxsoft/${name}.git`,
          onAuth: () => {
            // 如果用户保存了gitlabAuth，则使用gitlabAuth
            if (user['gitlabAuth']) return { headers: { authorization: user['gitlabAuth'] } };
            // 否则打开对话框要求用户输入Gitlab的账号密码
            return new Promise(resolve => {
              setLoading(false);
              let username = '';
              let pwd = '';

              const onSubmit = async (close?: Function) => {
                setLoading(true);
                // 这里要用Base64编码
                resolve({
                  headers: {
                    authorization:
                      `Basic ` +
                      Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(`${username}:${pwd}`)),
                  },
                });
                close?.();
                return true;
              };

              wxConfirm({
                title: 'Gitlab身份验证',
                disableBackdropClick: true,
                message: close => (
                  <>
                    <DialogContentText>拉取 {name} 的代码需要输入您的Gitlab密码</DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="gitlab-username"
                      label="Gitlab用户名"
                      fullWidth
                      onChange={e => {
                        username = e.target.value;
                      }}
                    />
                    <TextField
                      margin="dense"
                      id="gitlab-password"
                      label="Gitlab密码"
                      type="password"
                      onKeyPress={e => e.key === 'Enter' && onSubmit(close)}
                      fullWidth
                      onChange={e => {
                        pwd = e.target.value;
                      }}
                    />
                  </>
                ),
                onConfirm: onSubmit,
                onCancel: () => {
                  setLoading(true);
                  resolve({ cancel: true });
                },
              });
            });
          },
          onAuthFailure: () => {
            // 身份验证失败则清除GitlabAuth，下次重试会弹出对话框
            WxSnackBar.error('Gitlab身份验证失败！');
            user['gitlabAuth'] = '';
          },
          onAuthSuccess: async (url: string, auth) => {
            if (!user['gitlabAuth']) {
              // 验证成功保存身份信息
              user['gitlabAuth'] = auth.headers.authorization;
              await requestWxApi({
                url: '/WxUser/saveGitlabAuth',
                method: 'POST',
                data: { gitlabAuth: auth.headers.authorization },
              });
            }
          },
        });
        setReady(true);
      } catch (error) {
        setFailure(true);
      }
      setLoading(false);
    }
    clone();
  }, [name, retryCount]);

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Box px={2} height={36} width="100%" display="flex" alignItems="center" flexShrink={0}>
        <Logo width={24} height={24} />
        <Box ml={3}>
          <Typography color="textSecondary" variant="body2">
            文件
          </Typography>
        </Box>
        <Box ml={2}>
          <Typography color="textSecondary" variant="body2">
            编辑
          </Typography>
        </Box>
        <Box ml={2}>
          <Typography color="textSecondary" variant="body2">
            视图
          </Typography>
        </Box>
        <Typography
          style={{
            top: 6,
            position: 'absolute',
            left: '50%',
            transform: 'translate(-60%, 0)',
          }}
          variant="body1"
          color="textSecondary"
        >
          {name} - wxcloud studio
        </Typography>
      </Box>
      <Box display="flex" width="100%" height="100%">
        <Box
          display="flex"
          flexDirection="column"
          flexShrink={0}
          width={56}
          height="100%"
          alignItems="center"
        >
          <Box
            onClick={() => setActivedIndex(0)}
            className={clsx(styles.menuItem, activedIndex === 0 && styles.menuItemActived)}
          >
            <SvgIcon className={styles.menuIcon} color="inherit">
              <File />
            </SvgIcon>
          </Box>
          <Box
            onClick={() => setActivedIndex(1)}
            className={clsx(styles.menuItem, activedIndex === 1 && styles.menuItemActived)}
          >
            <SvgIcon className={styles.menuIcon} color="inherit">
              <GitBranch />
            </SvgIcon>
          </Box>
          <Box
            onClick={() => setActivedIndex(2)}
            className={clsx(styles.menuItem, activedIndex === 2 && styles.menuItemActived)}
          >
            <SvgIcon className={styles.menuIcon} color="inherit">
              <Docker width={28} height={28} />
            </SvgIcon>
          </Box>
        </Box>
        <Container style={{ height: '100%', flex: 1 }}>
          <Section
            style={{ background: theme.palette.background['dark'] }}
            defaultSize={250}
            minSize={150}
          >
            {(() => {
              switch (activedIndex) {
                case 0:
                  return <FileExplorer name={name} ready={ready} />;
              }
            })()}
          </Section>
          <Bar size={10} style={{ background: 'transparent', cursor: 'col-resize' }} />
          <Section style={{ background: theme.palette.background.default, flex: 1 }} minSize={600}>
            {failure && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                flex={1}
                height="100%"
              >
                <Error style={{ height: 100, width: 100 }} color="error" />
                <Box my={1}>
                  <Typography color="textSecondary"> 拉取代码失败 </Typography>
                </Box>
                <Button onClick={() => setRetryCount(retryCount + 1)}>重试</Button>
              </Box>
            )}
          </Section>
        </Container>
      </Box>
      <WxLoading loading={loading} />
    </Box>
  );
};
