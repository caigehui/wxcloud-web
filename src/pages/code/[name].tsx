import {
  Box,
  Button,
  DialogContentText,
  makeStyles,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { File, GitBranch, Search } from 'react-feather';
import clsx from 'clsx';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as Docker } from '@/assets/docker.svg';
import { Container, Section, Bar } from 'react-simple-resizer';
import FileExplorer from './components/FileExplorer';
import Crypto from 'crypto-js';
import LightningFS from '@isomorphic-git/lightning-fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import { Helmet } from 'react-helmet';
import WxLoading from '@/components/WxLoading';
import wxConfirm from '@/components/WxConfirm';
import { useModel } from 'umi';
import WxSnackBar from '@/components/WxSnackBar';
import { Error } from '@material-ui/icons';
import requestWxApi from '@/utils/requestWxApi';
import { useLocalStorageState } from 'ahooks';
import Editor from './components/Editor';
import FileSearch from './components/FileSearch';
const fs = new LightningFS('fs');

export const TABS_HEIGHT = 45;

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
  const { user } = useModel('useAuthModel');
  const name = location.pathname.replace('/code/', '');
  // 又Section宽度
  const [editorWidth, setEditorWidth] = useState(0);
  // 侧边栏菜单当前Index
  const [siderActiveIndex, setSiderActiveIndex] = useState(0);
  // git初始化
  const [loading, setLoading] = useState(false);
  // git初始化失败
  const [failure, setFailure] = useState(null);
  // git重试
  const [retryCount, setRetryCount] = useState(0);
  // 聚焦的文件
  const [focusItem, setFocusItem] = useLocalStorageState(`${user.id}-${name}-focus-item`, null);
  // 已经打开过的文件
  const [openItems, setOpenItems] = useLocalStorageState(`${user.id}-${name}-open-items`, []);
  // 未保存文件
  const [unsavedItems, setUnsavedItems] = useState([]);
  // 所有文件
  const [files, setFiles] = useState([]);

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
        // 获取文件目录
        const files = await git.listFiles({ fs, dir: '/' + name });
        setFiles(files);
      } catch (error) {
        setFailure('代码拉取失败');
      }
      setFailure(null);
      setLoading(false);
    }
    clone();
  }, [name, retryCount]);

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Helmet>
        <title>{name} - wxcloud studio</title>
      </Helmet>
      <Box display="flex" width="100%" height="100%">
        <Box
          display="flex"
          flexDirection="column"
          flexShrink={0}
          width={56}
          height="100%"
          alignItems="center"
        >
          <Box my={1}>
            <Logo width={32} height={32} />
          </Box>
          <Tooltip title="文件" placement="right" enterDelay={500}>
            <Box
              onClick={() => setSiderActiveIndex(0)}
              className={clsx(styles.menuItem, siderActiveIndex === 0 && styles.menuItemActived)}
            >
              <SvgIcon className={styles.menuIcon} color="inherit">
                <File />
              </SvgIcon>
            </Box>
          </Tooltip>{' '}
          <Tooltip title="搜索" placement="right" enterDelay={500}>
            <Box
              onClick={() => setSiderActiveIndex(1)}
              className={clsx(styles.menuItem, siderActiveIndex === 1 && styles.menuItemActived)}
            >
              <SvgIcon className={styles.menuIcon} color="inherit">
                <Search />
              </SvgIcon>
            </Box>
          </Tooltip>
          <Tooltip title="Git Commit" placement="right" enterDelay={500}>
            <Box
              onClick={() => setSiderActiveIndex(2)}
              className={clsx(styles.menuItem, siderActiveIndex === 2 && styles.menuItemActived)}
            >
              <SvgIcon className={styles.menuIcon} color="inherit">
                <GitBranch />
              </SvgIcon>
            </Box>
          </Tooltip>
          <Tooltip title="Docker部署" placement="right" enterDelay={500}>
            <Box
              onClick={() => setSiderActiveIndex(3)}
              className={clsx(styles.menuItem, siderActiveIndex === 3 && styles.menuItemActived)}
            >
              <SvgIcon className={styles.menuIcon} color="inherit">
                <Docker width={28} height={28} />
              </SvgIcon>
            </Box>
          </Tooltip>
        </Box>
        <Container style={{ height: '100%', flex: 1 }}>
          <Section
            style={{ background: theme.palette.background['dark'] }}
            defaultSize={300}
            minSize={300}
          >
            {(() => {
              switch (siderActiveIndex) {
                case 0:
                  return (
                    <FileExplorer
                      name={name}
                      files={files}
                      focusItem={focusItem}
                      setFocusItem={setFocusItem}
                      setOpenItems={setOpenItems}
                      openItems={openItems}
                    />
                  );
                case 1:
                  return (
                    <FileSearch
                      setFocusItem={setFocusItem}
                      focusItem={focusItem}
                      openItems={openItems}
                      setOpenItems={setOpenItems}
                      name={name}
                      files={files}
                    />
                  );
              }
            })()}
          </Section>
          <Bar size={10} style={{ background: 'transparent', cursor: 'col-resize' }}>
            <Box height={TABS_HEIGHT} bgcolor={theme.palette.background['dark']} width="100%" />
          </Bar>
          <Section
            onSizeChanged={width => setEditorWidth(width)}
            style={{ background: theme.palette.background.default, width: 'auto' }}
            minSize={600}
          >
            {!!failure ? (
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
                  <Typography color="textSecondary"> {failure} </Typography>
                </Box>
                <Button onClick={() => setRetryCount(retryCount + 1)}>重试</Button>
              </Box>
            ) : (
              <Editor
                ready={!!files}
                name={name}
                focusItem={focusItem}
                setFocusItem={setFocusItem}
                width={editorWidth}
                openItems={openItems}
                setOpenItems={setOpenItems}
                unsavedItems={unsavedItems}
                setUnsavedItems={setUnsavedItems}
              />
            )}
          </Section>
        </Container>
      </Box>
      <WxLoading loading={loading} />
    </Box>
  );
};
