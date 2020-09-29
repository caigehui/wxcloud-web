import WxPage from '@/components/WxPage';
import { Paper } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'umi';

export default ({ menu }) => {
  const history = useHistory();
  return <WxPage menu={menu}>123</WxPage>;
};
