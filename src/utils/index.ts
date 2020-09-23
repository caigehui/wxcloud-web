import { THEME } from '@wxsoft/wxcomponents/lib/constants';

export function getServerUrl() {
  return `${location.origin}/${process.env.APP_NAME}`;
}

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
