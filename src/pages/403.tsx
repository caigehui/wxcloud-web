import WxEmpty from '@/components/WxEmpty';
import { Lock } from '@material-ui/icons';
import React from 'react';

export default () => {
  return <WxEmpty title="您无权访问该页面" icon={<Lock color="primary" fontSize="inherit" />} />;
};
