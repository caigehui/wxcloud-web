/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import Parse from '@wxsoft/parse';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { useModel } from 'umi';
import { SocketIOProvider } from 'use-socketio';
import { hideLoader } from './utils/globalLoader';
import {
  SnackbarUtilsConfigurator,
  waitFor,
  createTheme,
  useGlobalStyles,
  getServerUrl,
} from '@wxsoft/wxcomponents';
import { THEME, THEME_KEY } from '@wxsoft/wxcomponents/lib/constants';
import { useLocalStorageState } from 'ahooks';
import { getDefaultTheme } from './utils';

Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY);
Parse.serverURL = getServerUrl();

type AppProps = {
  children: React.ReactNode;
};

export const qiankun = waitFor(1).then(() => {
  return {
    apps: [
      {
        name: 'wxboot',
        entry: '//localhost:8000/wxboot-boilerplate-web/',
      },
    ],
  };
});

export function useQiankunStateForSlave() {
  const [theme, setTheme] = useLocalStorageState<THEME>(THEME_KEY, getDefaultTheme());
  return {
    theme,
    setTheme,
  };
}

export async function getInitialState() {
  await waitFor(1000);
  hideLoader();
  return {};
}

const App = ({ children }: AppProps) => {
  const { theme } = useModel('@@qiankunStateForSlave');
  return (
    <ThemeProvider theme={createTheme(theme)}>
      <GlobalStyles>
        <SnackbarProvider>
          <SnackbarUtilsConfigurator />
          <SocketIOProvider url={`http://localhost:8000`}>{children}</SocketIOProvider>
        </SnackbarProvider>
      </GlobalStyles>
    </ThemeProvider>
  );
};

const GlobalStyles = ({ children }) => {
  useGlobalStyles();
  return children;
};

export function rootContainer(container: React.ReactNode) {
  return React.createElement(App, null, container);
}
