import request from '@wxsoft/wxboot/helpers/request';
import { AxiosRequestConfig } from 'axios';

export function buildRequest(state, options: AxiosRequestConfig) {
  return request({
    baseURL: state.url + '/wxeap-admin/wxapi',
    headers: {
      'X-Parse-Application-Id': 'wxeap-admin',
      'X-Parse-REST-API-Key': state.restApiKey,
      'X-Wxboot-Master-Key': state.secret,
      'Content-Type': 'application/json',
    },
    ...options,
  });
}
