import WxEmpty from '@/components/WxEmpty';
import { Help } from '@material-ui/icons';
import React from 'react';

export default () => {
  return <WxEmpty title="您访问的页面不存在" icon={<Help color="primary" fontSize="inherit" />} />;
};
