import React from 'react';
import {
  useSnackbar,
  VariantType,
  WithSnackbarProps,
  OptionsObject,
  SnackbarProvider,
} from 'notistack';
import { CircularProgress, useTheme } from '@material-ui/core';

interface IProps {
  setUseSnackbarRef: (showSnackbar: WithSnackbarProps) => void;
}

const InnerSnackbarUtilsConfigurator: React.FC<IProps> = (props: IProps) => {
  props.setUseSnackbarRef(useSnackbar());
  return null;
};

let useSnackbarRef: WithSnackbarProps;
const setUseSnackbarRef = (useSnackbarRefProp: WithSnackbarProps) => {
  useSnackbarRef = useSnackbarRefProp;
};

export const SnackbarUtilsConfigurator = () => {
  return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />;
};

const WxSnackBar = {
  success(msg: string) {
    this.toast(msg, 'success');
  },
  warning(msg: string) {
    this.toast(msg, 'warning');
  },
  info(msg: string) {
    this.toast(msg, 'info');
  },
  error(msg: string) {
    this.toast(msg, 'error');
  },
  loading(msg: string) {
    this.toast(msg, 'default', {
      autoHideDuration: null,
      key: 'loading',
    });
  },
  toast(msg: string, variant: VariantType = 'default', options?: OptionsObject) {
    useSnackbarRef?.enqueueSnackbar(
      msg,
      Object.assign(
        {
          variant,
          autoHideDuration: 2000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        },
        options,
      ),
    );
  },
  stopLoading() {
    useSnackbarRef.closeSnackbar('loading');
  },
};

export default WxSnackBar;

export function WxSnackBarProvider({ children }) {
  const theme = useTheme();

  return (
    <SnackbarProvider
      iconVariant={{
        default: (
          <CircularProgress
            style={{
              marginRight: theme.spacing(1),
            }}
            color="inherit"
            size={18}
          />
        ),
      }}
    >
      {children}
    </SnackbarProvider>
  );
}
