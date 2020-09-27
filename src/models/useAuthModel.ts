import { useState, useCallback } from 'react';
import { history } from 'umi';
import { useLocalStorageState, useTimeout } from 'ahooks';
import requestWxApi from '@/utils/requestWxApi';
import isEqual from 'lodash/isEqual';
import { WxUserApi, WxCommonApi } from '@wxapi/wxeap-admin';
import WxUser from '@wxsoft/wxboot/entities/WxUser';

function useAuthModel() {
  const [userData, setUserData] = useLocalStorageState('wx_user', null);
  const [user, setUser] = useState(userData ? new WxUser(userData) : null);
  const [menu, setMenu] = useLocalStorageState('wx_menu', []);

  const getMenu = useCallback(async () => {
    const data = await requestWxApi(WxCommonApi.getMenu());
    if (!isEqual(menu, data)) {
      setMenu(data);
    }
  }, []);

  useTimeout(async () => {
    if (user) {
      try {
        localStorage.setItem('sessionToken', userData.sessionToken);
        await WxUser.become(userData.sessionToken);
        await getMenu();
      } catch (error) {
        logOut();
      }
    }
  }, 1);

  const logIn = useCallback(async data => {
    const ret = await requestWxApi(WxUserApi.signIn(data));
    console.log(ret);
    localStorage.setItem('sessionToken', ret);
    await WxUser.become(ret);
    await getMenu();
    setUser(WxUser.me());
    setUserData(WxUser.me().toJSON());
    history.replace(history.location.query.returnUrl || '/');
  }, []);

  const logOut = useCallback(async () => {
    try {
      await WxUser.logOut();
      setUser(null);
      setUserData(null);
      localStorage.removeItem('sessionToken');
    } catch (error) {
      console.log(error.stack);
    }
  }, []);

  return {
    user,
    menu,
    getMenu,
    logIn,
    logOut,
  };
}
export default useAuthModel;
