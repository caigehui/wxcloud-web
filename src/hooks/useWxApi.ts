import { useRequest } from 'ahooks';
import requestWxApi from '../utils/requestWxApi';
import { AxiosPromise, AxiosRequestConfig } from 'axios';

export type WxRequest = (sessionToken?: string) => AxiosPromise<any>;
export type WxApi = (data?: any) => WxRequest;

export interface UseWxApiOptions {
  manual?: boolean;
  initialData?: any;
  defaultParams?: any;
  [key: string]: any;
  onSuccess?: (data: any) => void;
}

function useWxApi(config: AxiosRequestConfig, options?: UseWxApiOptions) {
  return useRequest((data?: any) => requestWxApi({ ...config, data }), {
    ...options,
  });
}

export default useWxApi;
