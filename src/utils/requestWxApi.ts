import nprogress from 'nprogress';
import { AxiosPromise } from 'axios';
import { history } from 'umi';
import WxSnackBar from '@/components/WxSnackBar';
import { WX_SESSION_TOKEN_KEY } from '@/constants';

export type WxRequest = (sessionToken?: string) => AxiosPromise<any>;
export type WxApi = (data?: any) => WxRequest;

/**
 * 请求wxapi
 * @param wxRequest wxRequest方法
 * @param whole 是否返回全部结构，默认只返回data
 */
async function requestWxApi(wxRequest: WxRequest, whole?: boolean) {
  try {
    const sessionToken = localStorage.getItem(WX_SESSION_TOKEN_KEY) || '';
    nprogress.start();
    const { data: ret } = await wxRequest(sessionToken);
    nprogress.done();
    if (ret.code === 0) {
      return whole ? ret : ret.data;
    } else {
      WxSnackBar.error(ret.message);
      if (ret.code === 1001) {
        history.push('/logout');
      }
      throw ret;
    }
  } catch (error) {
    console.log(error);
    nprogress.done();
    throw error;
  }
}

export default requestWxApi;
