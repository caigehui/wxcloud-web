import nprogress from 'nprogress';
import { AxiosPromise } from 'axios';
import { history } from 'umi';
import WxSnackBar from '@/components/WxSnackBar';
import { WX_SESSION_TOKEN_KEY } from '@/constants';
import { AxiosRequestConfig } from 'axios';
import request from './request';

export type WxRequest = (sessionToken?: string) => AxiosPromise<any>;
export type WxApi = (data?: any) => WxRequest;

/**
 * 请求wxapi
 * @param wxRequest wxRequest方法
 * @param whole 是否返回全部结构，默认只返回data
 */
async function requestWxApi(config: AxiosRequestConfig, whole?: boolean) {
  try {
    const sessionToken = localStorage.getItem(WX_SESSION_TOKEN_KEY) || '';
    nprogress.start();
    const { data: ret } = await request(config, sessionToken);
    nprogress.done();
    return whole ? ret : ret.data;
  } catch (error) {
    nprogress.done();

    const data = error.response?.data || error;
    console.error(error.status, data);

    WxSnackBar.error(
      typeof data.error === 'object' && data.error ? JSON.stringify(data.error) : data.error,
    );

    // 身份过期
    if (data.code === 1001 || data.code === 209) {
      history.push('/logout');
    }

    throw data;
  }
}

export default requestWxApi;
