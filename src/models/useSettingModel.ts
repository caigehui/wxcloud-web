import { useLocalStorageState } from 'ahooks';
import { THEME, THEME_KEY } from '@/constants';
import { getDefaultTheme } from '@/utils';

export default function useSettingModel() {
  const [theme, setTheme] = useLocalStorageState<THEME>(THEME_KEY, getDefaultTheme());
  return {
    theme,
    setTheme,
  };
}
