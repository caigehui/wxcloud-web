import React from 'react';
import { useSnackbar, VariantType, WithSnackbarProps, OptionsObject } from 'notistack';

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
    this.toast(msg, 'error', { anchorOrigin: { horizontal: 'center', vertical: 'top' } });
  },
  toast(msg: string, variant: VariantType = 'default', options: OptionsObject) {
    useSnackbarRef?.enqueueSnackbar(
      msg,
      Object.assign({ variant, autoHideDuration: 2000 }, options),
    );
  },
};

export default WxSnackBar;
