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
  IconButton,
  useTheme,
} from '@material-ui/core';
import { useHistory, useModel } from 'umi';
import { THEME } from '@/constants';
import { Brightness4, Brightness7, HelpOutlined } from '@material-ui/icons';

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
  const history = useHistory();
  const { user, logOut } = useModel('useAuthModel');
  const theme = useTheme();
  const { setTheme } = useModel('useSettingModel');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box display="flex" alignItems="center">
      <Box color={theme.palette.text.primary}>
        <IconButton color="inherit">
          <HelpOutlined />
        </IconButton>
      </Box>
      <Box mr={1} color={theme.palette.text.primary}>
        <IconButton
          onClick={() => {
            setTheme(theme['name'] === THEME.LIGHT ? THEME.ONE_DARK : THEME.LIGHT);
          }}
          color="inherit"
        >
          {theme['name'] === THEME.LIGHT ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        component={ButtonBase}
        onClick={handleOpen}
        mr={2}
        {...({ ref } as any)}
      >
        <Avatar
          style={{
            padding: 2,
            background: theme.palette.secondary.main,
          }}
          className={classes.avatar}
          src={user?.['avatar']?.url}
        />

        <Hidden smDown>
          <Typography variant="body1" color="textPrimary">
            {user?.['nickname']}
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
            history.push('/profile');
            handleClose();
          }}
        >
          个人设置
        </MenuItem>
        <MenuItem onClick={logOut}>退出登录</MenuItem>
      </Menu>
    </Box>
  );
}

export default Account;
