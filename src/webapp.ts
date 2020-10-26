export const proxy = () => {
  return {
    '/wxapi': {
      target: process.env.PROXY_TARGET,
      changeOrigin: true,
    },
  };
};
