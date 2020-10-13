import { useState, useCallback } from 'react';
import { history } from 'umi';
import { useLocalStorageState, useTimeout } from 'ahooks';
import requestWxApi from '@/utils/requestWxApi';
import isEqual from 'lodash/isEqual';
import WxUser from '@wxsoft/wxboot/entities/WxUser';
import request from '@wxsoft/wxboot/helpers/request';
import { WX_USER_KEY, WX_MENU_KEY, WX_SESSION_TOKEN_KEY } from '@/constants';
import checkPermission from '@wxsoft/wxboot/helpers/checkPermission';

function useAuthModel() {
  const [userJSON, setUserJSON] = useLocalStorageState(WX_USER_KEY, null);
  const [user, setUser] = useState(userJSON ? new WxUser(userJSON) : null);
  const [menu, setMenu] = useLocalStorageState<[]>(WX_MENU_KEY, []);

  const getCurrentUser = useCallback(async () => {
    const userData = await requestWxApi((sessionToken?: string) =>
      request({ method: 'GET', url: '/WxUser/getCurrentUser' }, sessionToken),
    );
    const user = new WxUser(userData);
    setUser(user);
    setUserJSON(userData);
  }, []);

  const getMenu = useCallback(async () => {
    const data = await requestWxApi((sessionToken?: string) =>
      request({ method: 'GET', url: '/WxCommon/getMenu' }, sessionToken),
    );
    if (!isEqual(menu, data)) {
      setMenu(data);
    }
  }, []);

  const getPermission = useCallback(async (code, key) => {
    if (!user?.permissions) return false;
    return checkPermission(user?.permissions, [code], key);
  }, []);

  useTimeout(async () => {
    if (user) {
      try {
        await getCurrentUser();
        await getMenu();
      } catch (error) {
        logOut();
      }
    }
  }, 1);

  const logIn = useCallback(async data => {
    const sessionToken = await requestWxApi(() =>
      request({ data, method: 'POST', url: '/WxUser/signIn' }),
    );
    if (typeof sessionToken === 'string') {
      localStorage.setItem(WX_SESSION_TOKEN_KEY, sessionToken);
    }
    await getCurrentUser();
    await getMenu();

    // 回到returnUrl或者/
    history.replace(history.location.query.returnUrl || '/');
  }, []);

  const logOut = useCallback(async () => {
    try {
      await WxUser.logOut();
      setUser(null);
      setUserJSON(null);
      setMenu([]);
      localStorage.removeItem(WX_SESSION_TOKEN_KEY);
      localStorage.removeItem(WX_USER_KEY);
      localStorage.removeItem(WX_MENU_KEY);
    } catch (error) {
      console.log(error.stack);
    }
  }, []);

  return {
    user,
    getCurrentUser,
    menu,
    logIn,
    logOut,
    getPermission,
  };
}
export default useAuthModel;
