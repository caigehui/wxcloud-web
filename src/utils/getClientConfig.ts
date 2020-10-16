import request from '@wxsoft/wxboot/helpers/request';

export default function getClientConfig() {
  return request({ url: '/WxCommon/getClientConfig' }).then(res => res.data.data);
}
