import React from 'react';
import {
  Dialog,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
  DialogActions,
  DialogContent,
  makeStyles,
  Box,
} from '@material-ui/core';

export interface IWxDialogProps {
  open: boolean;
  onClose?: any;
  fullScreen?: boolean;
  title?: string;
  titleIcon?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onExited?: any;
}

const useStyles = makeStyles({
  content: {
    '&::-webkit-scrollbar': {
      width: 6,
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgb(130, 130, 130)',
      borderRadius: 3,
    },
  },
});

function WxDialog({
  open,
  fullScreen,
  onClose,
  title,
  titleIcon,
  children,
  actions,
  width = 'sm',
  onExited,
}: IWxDialogProps) {
  const styles = useStyles();
  const theme = useTheme();
  const fs = fullScreen ?? useMediaQuery(theme.breakpoints.down(width));

  return (
    <Dialog
      maxWidth={width}
      fullWidth
      fullScreen={fs}
      open={open}
      onClose={onClose}
      onExited={onExited}
    >
      <DialogTitle disableTypography>
        <Box display="flex">
          {titleIcon && (
            <Box mr={1} color={theme.palette.primary.main}>
              {titleIcon}
            </Box>
          )}
          <Typography variant="h3" color="textPrimary">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent className={styles.content}>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
}

export default WxDialog;
