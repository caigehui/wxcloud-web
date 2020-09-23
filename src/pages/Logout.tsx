import React from 'react';
import { useMount } from 'ahooks';
import { useModel } from 'umi';

function Logout() {
  const { logOut } = useModel('useAuthModel');
  useMount(() => {
    logOut();
  });
  return <div />;
}

export default Logout;
