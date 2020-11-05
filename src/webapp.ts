import { Options } from 'http-proxy-middleware';
import { config } from 'dotenv-flow';
const { parsed } = config({ silent: true, node_env: process.env.NODE_ENV });

export const proxy = (): { [key: string]: Options } => {
  return {
    '/wxapi': {
      target: parsed.PROXY_TARGET,
      changeOrigin: true,
      headers: {
        apikey: parsed.API_KEY,
      },
    },
    // 文件资源的代理
    [`/files/${process.env.APP_ID}`]: {
      target: parsed.PROXY_TARGET,
      changeOrigin: true,
      headers: {
        apikey: parsed.API_KEY,
      },
    },
    // 文件上传代理
    '/files': {
      target: parsed.PROXY_TARGET,
      changeOrigin: true,
      headers: {
        apikey: parsed.API_KEY,
      },
      pathRewrite: { '^/files': '/' },
    },
  };
};
