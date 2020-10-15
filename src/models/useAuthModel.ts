import { useState, useCallback } from 'react';
import { history } from 'umi';
import { useLocalStorageState, useTimeout } from 'ahooks';
import requestWxApi from '@/utils/requestWxApi';
import WxUser from '@wxsoft/wxboot/entities/WxUser';
import request from '@wxsoft/wxboot/helpers/request';
import { WX_USER_KEY, WX_MENU_KEY, WX_SESSION_TOKEN_KEY } from '@/constants';
import checkPermission from '@wxsoft/wxboot/helpers/checkPermission';
import wxConfirm from '@/components/WxConfirm';
import { AES } from 'crypto-js';

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
    setMenu(data);
  }, []);

  const getPermission = useCallback(
    (code, key) => {
      if (!user?.['permissions']) return false;
      return checkPermission(user?.['permissions'], [code], key);
    },
    [user],
  );

  /**
   * 信任浏览器
   */
  const browser = useCallback(async (browserId: string, trust: boolean) => {
    await requestWxApi((sessionToken?: string) =>
      request(
        {
          method: 'POST',
          url: '/WxUser/browser',
          data: {
            browserId,
            trust,
          },
        },
        sessionToken,
      ),
    );
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
  }, 100);

  const logIn = useCallback(async data => {
    const { token, first } = await requestWxApi(() =>
      request({
        data: {
          ...data,
          password: AES.encrypt(data.password, process.env.RECAPTCHAT_KEY).toString(),
        },
        method: 'POST',
        url: '/WxUser/signIn',
      }),
    );
    if (typeof token === 'string') {
      localStorage.setItem(WX_SESSION_TOKEN_KEY, token);
    }

    await getCurrentUser();
    await getMenu();

    if (first) {
      wxConfirm({
        title: '安全检测',
        message: '检测到您在新的浏览器登录系统，是否信任该浏览器？稍后可以在个人设置中更改信任。',
        onConfirm: async () => {
          await browser(data.browserId, true);
          history.replace(history.location.query.returnUrl || '/');
          return true;
        },
        onCancel: async () => {
          await browser(data.browserId, false);
          history.replace(history.location.query.returnUrl || '/');
        },
        confirmText: '信任',
        cancelText: '不信任',
      });
    } else {
      // 回到returnUrl或者/
      history.replace(history.location.query.returnUrl || '/');
    }
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
