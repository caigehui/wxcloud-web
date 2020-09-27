/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import Parse from '@wxsoft/parse';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { useModel } from 'umi';
import { SocketIOProvider } from 'use-socketio';
import { hideLoader } from './utils/globalLoader';
import { waitFor, getServerUrl } from '@/utils';
import { SnackbarUtilsConfigurator } from '@/components/WxSnackBar';
import { createTheme } from '@/theme';
import useGlobalStyles from '@/theme/global';

Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY);
Parse.serverURL = getServerUrl();

type AppProps = {
  children: React.ReactNode;
};

export async function getInitialState() {
  await waitFor(1000);
  hideLoader();
  return {};
}

const App = ({ children }: AppProps) => {
  const { theme } = useModel('useSettingModel');
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
