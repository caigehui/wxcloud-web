/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import Parse from '@wxsoft/parse';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { useModel } from 'umi';
import { hideLoader } from './utils/globalLoader';
import { waitFor, getServerUrl } from '@/utils';
import { SnackbarUtilsConfigurator, WxSnackBarProvider } from '@/components/WxSnackBar';
import { createTheme } from '@/theme';
import useGlobalStyles from '@/theme/global';
import { CircularProgress } from '@material-ui/core';

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
        <WxSnackBarProvider>
          <SnackbarUtilsConfigurator />
          {children}
        </WxSnackBarProvider>
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
