import request from '@wxsoft/wxboot/helpers/request';
import { AxiosRequestConfig } from 'axios';
import nprogress from 'nprogress';
import { history } from 'umi';
import WxSnackBar from '@/components/WxSnackBar';

export async function buildRequest(
  state,
  options: AxiosRequestConfig,
  noHandle?: boolean,
  noProgress?: boolean,
) {
  const req = request({
    baseURL: state.url + '/wxeap-admin/wxapi',
    headers: {
      'X-Parse-Application-Id': 'wxeap-admin',
      apikey: process.env.API_KEY,
      'X-Wxboot-Master-Key': state.secret,
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (noHandle) return req;
  try {
    !noProgress && nprogress.start();
    const { data: ret } = await req;
    !noProgress && nprogress.done();
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

export function getGaugeOption(theme, title, data) {
  return {
    title: {
      text: title,
    },
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        name: title,
        type: 'gauge',
        center: ['50%', '55%'],
        min: 0,
        max: 100,
        title: {
          color: theme.palette.text.primary,
        },
        pointer: { width: 2 },
        axisLine: { lineStyle: { width: 10 } },
        splitLine: { length: 15 },
        detail: {
          color: theme.palette.text.primary,
          fontSize: 18,
          // @ts-ignore
          formatter: '{value}%',
        },
        data: [{ value: data || 0, name: '利用率' }],
      },
    ],
  };
}
