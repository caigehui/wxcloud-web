/* eslint-disable react/no-unescaped-entities */
import WxPage from '@/components/WxPage';
import WxSnackBar from '@/components/WxSnackBar';
import { download } from '@/utils';
import {
  Box,
  Button,
  Link,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from '@material-ui/core';
import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { Download } from 'react-feather';
import { Redirect, useHistory, useLocation } from 'umi';
import { buildRequest } from '../register/utils';

const CommandBox = ({ children }) => {
  const theme = useTheme();
  return (
    <Box bgcolor={theme.palette.background['dark']} p={2} my={2}>
      <Typography>{children}</Typography>
    </Box>
  );
};

export default ({ menu }) => {
  const location = useLocation();
  const state = location.state;
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  if (!state) return <Redirect to="/register" />;

  const history = useHistory();

  // 测试连通性
  const { loading, run } = useRequest(
    () =>
      buildRequest(
        state,
        {
          timeout: 2000,
          timeoutErrorMessage: '连接超时',
          url: '/WxDevelop/about',
        },
        true,
      ),
    {
      loadingDelay: 500,
      manual: true,
      throwOnError: true,
    },
  );

  const enter = async () => {
    if (loading) return;
    try {
      WxSnackBar.loading('正在连接服务器');
      await run();
      WxSnackBar.stopLoading();
      history.push('/register/general', state);
    } catch (error) {
      WxSnackBar.stopLoading();
      console.error(error);
      WxSnackBar.error('无法访问该服务器');
    }
  };

  return (
    <WxPage menu={menu} title={'服务端配置教程'} showBackIcon>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>
            <Typography variant="h4">安装Docker环境</Typography>
          </StepLabel>
          <StepContent>
            <Box display="flex" flexDirection="column" my={2}>
              <Typography>
                在 CentOS 下，进入合适的目录，使用下面的命令下载 Docker 安装脚本
              </Typography>
              <CommandBox>
                $ curl -H "apikey: {process.env.API_KEY}" -o dockerinstall.sh{' '}
                {window.location.origin}
                /wxcloud/download/dockerinstall.sh
              </CommandBox>
              <Typography>给sh文件添加权限</Typography>
              <CommandBox>$ chmod +x dockerinstall.sh</CommandBox>{' '}
              <Typography>执行安装脚本</Typography>
              <CommandBox>$ ./dockerinstall.sh</CommandBox>
              <Typography>
                安装成功后，使用本系统的账号密码进行Docker镜像仓库的登录，如果没有登录，在拉取镜像的环节中会报错
              </Typography>
              <CommandBox>$ docker login https://mirrors.wxsoft.cn/</CommandBox>
              <Typography>
                备注：其他系统可参考
                <Link href="https://docs.docker.com/engine/install/" target="_blank">
                  官方教程
                </Link>
                安装Docker
              </Typography>
              <Box display="flex" mt={2}>
                <Button variant="contained" color="primary" onClick={() => setActiveStep(1)}>
                  下一步
                </Button>
              </Box>
            </Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            <Typography variant="h4">安装Docker Compose</Typography>
          </StepLabel>
          <StepContent>
            <Box display="flex" flexDirection="column" my={2}>
              <Typography>
                Docker Compose 是Docker官方提供的容器编排工具，可以使用下面的命令快速安装
              </Typography>
              <CommandBox>
                $ sudo curl -H "apikey: {process.env.API_KEY}" -o /usr/local/bin/docker-compose
                {window.location.origin}
                /wxcloud/download/docker-compose-Linux-x86_64
              </CommandBox>
              <Typography>添加权限</Typography>
              <CommandBox>$ sudo chmod +x /usr/local/bin/docker-compose</CommandBox>{' '}
              <Typography>添加本地环境变量</Typography>
              <CommandBox>
                $ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
              </CommandBox>
              <Typography>完成安装</Typography>
              <Box display="flex" mt={2}>
                <Button onClick={() => setActiveStep(0)} style={{ marginRight: theme.spacing(2) }}>
                  上一步
                </Button>
                <Button variant="contained" color="primary" onClick={() => setActiveStep(2)}>
                  下一步
                </Button>
              </Box>
            </Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            <Typography variant="h4">下载安全证书</Typography>
          </StepLabel>
          <StepContent>
            <Box display="flex" flexDirection="column" my={2}>
              <Typography>
                为了保护网欣云和服务器之间的通信安全，需要下载由网欣云颁发的数字证书，并且放置到服务器的
                home 目录下，请确保位置 (/home/client.cert) 正确
              </Typography>

              <Box display="flex" mt={2}>
                <Button onClick={() => setActiveStep(1)} style={{ marginRight: theme.spacing(2) }}>
                  上一步
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    download('client.cert', state['certificate']);
                  }}
                  style={{ marginRight: theme.spacing(2) }}
                  startIcon={<Download />}
                >
                  下载证书
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    download('client.private.pem', state['clientPrivateKey']);
                  }}
                  style={{ marginRight: theme.spacing(2) }}
                  startIcon={<Download />}
                >
                  下载私钥（可选）
                </Button>
                <Button variant="contained" color="primary" onClick={() => setActiveStep(3)}>
                  下一步
                </Button>
              </Box>
            </Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            <Typography variant="h4">部署</Typography>
          </StepLabel>
          <StepContent>
            <Box display="flex" flexDirection="column" my={2}>
              <Typography>进入合适的目录，使用下面的命令下载 docker-compose.yml 文件</Typography>
              <CommandBox>
                $ sudo curl -H "apikey: {process.env.API_KEY}" -o docker-compose.yml{' '}
                {window.location.origin}
                /wxcloud/download/docker-compose.yml?masterKey=
                {state['masterKey']}\&secret={state['secret']}
              </CommandBox>
              <Typography>
                在 docker-compose.yml 文件所在目录下，使用下面的命令批量拉取镜像和启动服务
              </Typography>
              <CommandBox>$ docker-compose up -d</CommandBox>
              <Typography>完成部署</Typography>
              <Box display="flex" mt={2}>
                <Button onClick={() => setActiveStep(2)} style={{ marginRight: theme.spacing(2) }}>
                  上一步
                </Button>
                <Button variant="contained" color="primary" onClick={() => setActiveStep(4)}>
                  完成
                </Button>
              </Box>
            </Box>
          </StepContent>
        </Step>
        {activeStep > 3 && (
          <Paper square elevation={0}>
            <Box pt={2} display="flex">
              <Button onClick={() => setActiveStep(0)} style={{ marginRight: theme.spacing(2) }}>
                重新开始
              </Button>
              <Button variant="contained" color="primary" onClick={enter}>
                管理服务器
              </Button>
            </Box>
          </Paper>
        )}
      </Stepper>
    </WxPage>
  );
};
