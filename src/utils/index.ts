import { THEME } from '@/constants';
import Fingerprint2 from '@fingerprintjs/fingerprintjs';
import { AES, enc } from 'crypto-js';
import { RSAKey } from 'jsrsasign';

/**
 * 将search字符串解析成对象
 * @param {string} str
 */
export function getRouterSearch(str: string): Object {
  // 如果是xxx.yyy?search，则截取search
  if (str.lastIndexOf('?') > -1) {
    str = str.substring(str.lastIndexOf('?'));
  }
  const param = decodeURI(str)
    .substring(1)
    .split('&');
  let obj = {};
  for (let i = 0; i < param.length; i++) {
    const key = param[i].substring(0, param[i].indexOf('='));
    const value = param[i].substring(param[i].indexOf('=') + 1);
    const item = {};
    item[key] = value;
    obj = { ...obj, ...item };
  }
  return obj;
}

export const getMenuPathByKey = (key: string, menu: any[]) => {
  for (const i of menu) {
    if (i.key === key) return '/' + i.key;
    else if (i.children) {
      const ret = getMenuPathByKey(key, i.children);
      if (ret) return '/' + i.key + ret;
    }
  }
};

export function flatChildren<T extends { parent?: string }>(
  array: T[],
  key = 'children',
  nameKey = 'name',
) {
  function collect(array: T[], result: T[], parent?: string) {
    array?.forEach(function(el: T) {
      if (!parent) {
        parent = '/';
      }
      el.parent = parent;
      if (el[key]) {
        collect(el[key], result, parent + el[nameKey] + '/');
      } else {
        result.push(el);
      }
    });
  }
  const ret: T[] = [];
  collect(array || [], ret);
  return ret;
}

export function getDefaultTheme() {
  let defaultTheme = THEME.LIGHT;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    defaultTheme = THEME.ONE_DARK;
  }
  return defaultTheme;
}

export const getMenuItemNameByKey = (key: string, menu: any[]) => {
  if (!Array.isArray(menu)) return '';
  for (const i of menu) {
    if (i.key === key) return i.name;
    else if (i.children) {
      const ret = getMenuItemNameByKey(key, i.children);
      if (ret) return ret;
    }
  }
};

export function waitFor(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getSystemTheme() {
  let defaultTheme = THEME.LIGHT;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    defaultTheme = THEME.ONE_DARK;
  }
  return defaultTheme;
}

export const getFingerprint = () => {
  return new Promise(resolve => {
    const get = () => {
      Fingerprint2.get((components: Array<any>) => {
        // 参数
        const values = components.map(component => {
          return component.value;
        });
        // 指纹
        const murmur = Fingerprint2.x64hash128(values.join(''), 31);
        resolve(murmur);
      });
    };
    if (window['requestIdleCallback']) {
      window['requestIdleCallback'](get);
    } else {
      get();
    }
  });
};

let enableReCaptcha = true;

export const addReCaptcha = (enabled: boolean) => {
  enableReCaptcha = enabled;
  if (enabled) {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src =
        'https://www.recaptcha.net/recaptcha/api.js?render=' + process.env.RECAPTCHAT_KEY;
      document.body.appendChild(script);
      script.addEventListener('load', () => {
        resolve();
      });
    });
  } else {
    return;
  }
};

export const getReCaptchaToken = () => {
  return new Promise((resolve, reject) => {
    if (enableReCaptcha) {
      window['grecaptcha'].ready(() => {
        window['grecaptcha']
          ?.execute(process.env.RECAPTCHAT_KEY, { action: 'submit' })
          .then(resolve)
          .catch(reject);
      });
    } else {
      resolve('disabledToken');
    }
  });
};

export function makeStr(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let _wxrsa = null;

export function handleClientKey(key: string) {
  const rsa = new RSAKey();
  rsa.readPrivateKeyFromPEMString(
    AES.decrypt(key, process.env.APP_ID + process.env.API_KEY).toString(enc.Utf8),
  );
  _wxrsa = rsa;
}

export function getRsa() {
  return _wxrsa;
}

export function download(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
