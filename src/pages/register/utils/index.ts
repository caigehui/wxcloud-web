import { AxiosRequestConfig } from 'axios';
import nprogress from 'nprogress';
import { history } from 'umi';
import WxSnackBar from '@/components/WxSnackBar';
import { EChartOption } from 'echarts/lib/echarts';
import dayjs from 'dayjs';
import get from 'lodash/get';
import request from '@/utils/request';
import { makeStr } from '@/utils';
import { SHA1 } from 'crypto-js';
import { RSAKey } from 'jsrsasign';

export async function buildRequest(
  state,
  options: AxiosRequestConfig,
  noHandle?: boolean,
  noProgress?: boolean,
  appId?: string,
) {
  const timestamp = Date.now().toString();
  const echostr = makeStr(32);
  const wxbootMasterKey = state.secret;
  const md5 = SHA1(JSON.stringify({ echostr, timestamp, wxbootMasterKey })).toString();

  const rsa = new RSAKey();
  rsa.readPrivateKeyFromPEMString(state.clientPrivateKey);

  const req = request({
    baseURL: state.url + '/wxeap-admin/wxapi',
    headers: {
      'X-Parse-Application-Id': appId || 'wxeap-admin',
      apikey: process.env.API_KEY,
      'X-Wxboot-Master-Key': wxbootMasterKey,
      'Content-Type': 'application/json',
      'X-timestamp': timestamp,
      'X-echostr': echostr,
      'X-sign': rsa.sign?.(md5, 'sha1'),
    },
    ...options,
  });
  if (noHandle) return req;
  try {
    !noProgress && nprogress.start();
    const { data: ret } = await req;
    !noProgress && nprogress.done();
    return ret;
  } catch (error) {
    const data = error.response?.data || error;
    console.log(error.status, data);
    WxSnackBar.error(data.error);
    if (data.code === 1001) {
      history.push('/register');
    }
    nprogress.done();
    throw data;
  }
}

export function getGaugeOption(theme: any, title: string, name: string, data: string) {
  return {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        name: title,
        radius: '90%',
        type: 'gauge',
        center: ['50%', '50%'],
        min: 0,
        max: 100,
        title: {
          color: theme.palette.text.primary,
        },
        axisLine: {
          // 坐标轴线
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [
              [0.2, '#1890ff'],
              [0.8, '#1890ff'],
              [1, '#ff7a45'],
            ],
            width: 10,
          },
        },
        pointer: { width: 2 },
        splitLine: { length: 15 },
        detail: {
          color: theme.palette.text.primary,
          fontSize: 18,
          // @ts-ignore
          formatter: '{value}%',
        },
        data: [{ value: data || 0, name }],
      },
    ],
  };
}

export function getContainerOptions(
  data: Array<any>,
  field: string,
  unitTransform: Function,
  unit: string,
) {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
          formatter: value => {
            if (value.axisDimension === 'x') {
              return dayjs(value.value).format('HH:mm:ss');
            } else {
              return value.value.toFixed(2) + unit;
            }
          },
        },
      },
    },
    grid: {
      show: true,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    legend: {
      data: data?.[0]?.containers?.map(i => i.name),
    },
    xAxis: {
      type: 'time',
      name: '时间',
      splitNumber: 10,
      axisLabel: {
        formatter: value => dayjs(value).format('HH:mm:ss'),
      },
    },
    yAxis: {
      type: 'value',
    },
    series: data?.[0]?.containers?.map(i => {
      return {
        name: i.name,
        type: 'line',
        symbolSize: 1,
        data: data.map(j => [
          j.time.iso,
          unitTransform(
            get(
              j.containers.find(z => z.name === i.name),
              field,
            ),
          ),
        ]),
        dimensions: ['timestamp', 'value'],
        encode: {
          x: 'timestamp',
          y: 'value',
        },
      };
    }),
  } as EChartOption;
}
