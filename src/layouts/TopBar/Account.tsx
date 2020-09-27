import React, { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  ButtonBase,
  Hidden,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useModel } from 'umi';
import { THEME } from '@/constants';

const useStyles = makeStyles(theme => ({
  avatar: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1),
  },
  popover: {
    width: 200,
  },
}));

function Account() {
  const classes = useStyles();
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const { user, logOut } = useModel('useAuthModel');
  const { theme, setTheme } = useModel('useSettingModel');
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        component={ButtonBase}
        onClick={handleOpen}
        {...({ ref } as any)}
      >
        <Avatar alt="User" className={classes.avatar} src="" />
        <Hidden smDown>
          <Typography variant="h6" color="textPrimary">
            {user?.nickname}
          </Typography>
        </Hidden>
      </Box>
      <Menu
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        keepMounted
        PaperProps={{ className: classes.popover }}
        getContentAnchorEl={null}
        anchorEl={ref.current}
        open={isOpen}
      >
        <MenuItem
          onClick={() => {
            setTheme(theme === THEME.LIGHT ? THEME.ONE_DARK : THEME.LIGHT);
            handleClose();
          }}
        >
          切换主题
        </MenuItem>
        <MenuItem onClick={logOut}>退出登录</MenuItem>
      </Menu>
    </>
  );
}

export default Account;
