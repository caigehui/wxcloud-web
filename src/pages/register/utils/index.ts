import request from '@wxsoft/wxboot/helpers/request';
import { AxiosRequestConfig } from 'axios';
import nprogress from 'nprogress';
import { history } from 'umi';
import WxSnackBar from '@/components/WxSnackBar';

export async function buildRequest(state, options: AxiosRequestConfig, noHandle?: boolean) {
  const req = request({
    baseURL: state.url + '/wxeap-admin/wxapi',
    headers: {
      'X-Parse-Application-Id': 'wxeap-admin',
      'apikey': process.env.API_KEY,
      'X-Wxboot-Master-Key': state.secret,
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (noHandle) return req;
  try {
    nprogress.start();
    const { data: ret } = await req;
    nprogress.done();
    if (ret.code === 0) {
      return ret;
    } else {
      WxSnackBar.error(ret.message);
      if (ret.code === 1001) {
        history.push('/regsiter');
      }
      return ret;
    }
  } catch (error) {
    console.log(error);
    nprogress.done();
    throw error;
  }
}
