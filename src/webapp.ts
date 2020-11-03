import { Options } from 'http-proxy-middleware';

export const proxy = (): { [key: string]: Options } => {
  return {
    '/wxapi': {
      target: process.env.PROXY_TARGET,
      changeOrigin: true,
      headers: {
        apikey: process.env.API_KEY,
      },
    },
    // 文件资源的代理
    [`/files/${process.env.APP_ID}`]: {
      target: process.env.PROXY_TARGET,
      changeOrigin: true,
      headers: {
        apikey: process.env.API_KEY,
      },
    },
    // 文件上传代理
    '/files': {
      target: process.env.PROXY_TARGET,
      changeOrigin: true,
      headers: {
        apikey: process.env.API_KEY,
      },
      pathRewrite: { '^/files': '/' },
    },
  };
};
