import request from './request';

export default function getClientConfig() {
  return request({ url: '/WxCommon/getClientConfig' }).then(res => res.data.data);
}
