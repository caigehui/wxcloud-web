import { Options } from 'http-proxy-middleware';
export const proxy = (): { [key: string]: Options } => {
  return {
    '/wxapi': {
      target: process.env.PROXY_TARGET,
      changeOrigin: true,
    },
    '/files': {
      target: process.env.PROXY_TARGET,
      changeOrigin: true,
      headers: {
        apikey: process.env.API_KEY,
      },
    },
  };
};
