import { useRequest } from 'ahooks';
import requestWxApi from '../utils/requestWxApi';
import { AxiosPromise } from 'axios';

export type WxRequest = (sessionToken?: string) => AxiosPromise<any>;
export type WxApi = (data?: any) => WxRequest;

export interface UseWxApiOptions {
  manual?: boolean;
  initialData?: any;
  defaultParams?: any;
  [key: string]: any;
  onSuccess?: (data: any) => void;
}

function useWxApi(wxApi: WxApi, options?: UseWxApiOptions) {
  return useRequest((data?: any) => requestWxApi(wxApi(data)), {
    ...options,
  });
}

export default useWxApi;
