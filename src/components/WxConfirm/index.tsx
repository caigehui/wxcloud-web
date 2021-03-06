import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { DialogContentText, Button, ThemeProvider, Box, CircularProgress } from '@material-ui/core';
import WxDialog from '../WxDialog';
import { createTheme } from '@/theme';
import { THEME_KEY } from '@/constants';
import { getDefaultTheme } from '@/utils';

export interface WxConfirmOptions {
  title?: string;
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message: React.ReactNode;
  onConfirm: () => Promise<boolean> | void;
  onCancel?: () => void;
  onNuetral?: () => void;
  confirmText?: string;
  nuetralText?: string;
  cancelText?: string;
  disableBackdropClick?: boolean;
}

/**
 * 弹出确认提示框
 * @param options.title 标题
 * @param options.message 展示的通知文本或者元素
 * @param options.onSucess 点击确定按钮的回调，支持Promise
 * @param options.onCancel 点击取消按钮的回调
 */
export default function wxConfirm(options: WxConfirmOptions) {
  const root = document.querySelector('#root');
  const wxconfirm = document.createElement('div');
  root.appendChild(wxconfirm);
  const el = (
    <WxConfirm
      options={options}
      onClose={() => {
        root.removeChild(wxconfirm);
      }}
    />
  );
  ReactDOM.render(el, wxconfirm);
}

export interface IWxConfirmProps {
  onClose: any;
  options: WxConfirmOptions;
}

function WxConfirm({ onClose, options }: IWxConfirmProps) {
  const theme = localStorage.getItem(THEME_KEY)?.replace(/"/g, '') || getDefaultTheme();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const myTheme = createTheme(theme);
  const onConfirm = useCallback(async () => {
    const type = options.onConfirm();
    if (type instanceof Promise) {
      setLoading(true);
      const ret = await type;
      setLoading(false);
      !!ret && setOpen(false);
    } else {
      setOpen(false);
    }
  }, []);
  return (
    <ThemeProvider theme={myTheme}>
      <WxDialog
        title={options.title}
        open={open}
        width={options.width}
        disableBackdropClick={options.disableBackdropClick}
        onClose={() => !loading && setOpen(false)}
        onExited={onClose}
        actions={
          <React.Fragment>
            <Box color={myTheme.palette.text.hint}>
              <Button
                disabled={loading}
                onClick={() => {
                  options.onCancel?.();
                  setOpen(false);
                }}
                color="inherit"
              >
                {options.cancelText || '取消'}
              </Button>
            </Box>
            {options.nuetralText && (
              <Box color={myTheme.palette.text.hint}>
                <Button
                  disabled={loading}
                  onClick={() => {
                    options.onNuetral?.();
                    setOpen(false);
                  }}
                  color="inherit"
                >
                  {options.nuetralText}
                </Button>
              </Box>
            )}
            <Box color={myTheme.palette.primary.main}>
              <Button onClick={onConfirm} disabled={loading} color="inherit">
                {loading ? (
                  <CircularProgress color="primary" size={18} />
                ) : (
                  options.confirmText || '确定'
                )}
              </Button>
            </Box>
          </React.Fragment>
        }
      >
        {typeof options.message === 'string' ? (
          <DialogContentText>{options.message}</DialogContentText>
        ) : typeof options.message === 'function' ? (
          options.message(() => setOpen(false))
        ) : (
          options.message
        )}
      </WxDialog>
    </ThemeProvider>
  );
}
