import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { AppBar, Box, Hidden, IconButton, Toolbar, makeStyles, SvgIcon } from '@material-ui/core';
import { Menu as MenuIcon } from 'react-feather';
import Account from './Account';
import { THEME } from '@wxsoft/wxcomponents/lib/constants';
// import KeepAliveTabs from './KeepAliveTabs';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    ...(theme['name'] === THEME.LIGHT
      ? {
          boxShadow: 'none',
          backgroundColor: theme.palette.primary.main,
        }
      : {}),
    ...(theme['name'] === THEME.ONE_DARK
      ? {
          backgroundColor: theme.palette.background.default,
        }
      : {}),
  },
  toolbar: {
    minHeight: 64,
    display: 'flex',
    width: '100vw',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  logo: {
    width: 256,
  },
}));

function TopBar({ className, onMobileNavOpen, ...rest }: { [key: string]: any }) {
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} {...rest}>
      <Toolbar disableGutters className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton className={classes.menuButton} color="inherit" onClick={onMobileNavOpen}>
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
          <Box flexGrow={1} />
        </Hidden>
        <Hidden mdDown>
          <RouterLink className={classes.logo} to="/"></RouterLink>
          <Box flexGrow={1} flexShrink={1} alignSelf="flex-end"></Box>
        </Hidden>
        <Box mx={2}>
          <Account />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

export default TopBar;
