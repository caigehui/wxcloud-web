import axios, { AxiosRequestConfig } from 'axios';
import { getRsa, makeStr } from '.';
import { SHA1 } from 'crypto-js';

// 如果存在代理的TARGET，则不需要指定url
export const serverURL = process.env.PROXY_TARGET
  ? ''
  : `http://localhost:${process.env.WXBOOT_PORT}`;

async function request(config: AxiosRequestConfig, sessionToken?: string) {
  const timestamp = Date.now().toString();
  const echostr = makeStr(32);

  const headers = {
    'X-Parse-Application-Id': process.env.APP_ID,
    apikey: process.env.API_KEY,
  };
  if (sessionToken) {
    const md5 = SHA1(JSON.stringify({ echostr, sessionToken, timestamp })).toString();
    Object.assign(headers, {
      'X-Parse-Session-Token': sessionToken,
      'Content-Type': 'application/json',
      'X-timestamp': timestamp,
      'X-echostr': echostr,
      'X-sign': getRsa?.().sign?.(md5, 'sha1'),
    });
  }
  const dataOptions = config.method === 'GET' ? { params: config.data } : { data: config.data };
  return axios({
    headers,
    baseURL: serverURL + '/wxapi',
    ...config,
    ...dataOptions,
  });
}

export default request;
