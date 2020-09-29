import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import { Menu as MenuIcon } from 'react-feather';
import Account from './Account';
import { SIDEBAR_WIDTH } from '../Sidebar';
import { ReactComponent as Logo } from '@/assets/logo.svg';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 100,
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
    backgroundColor: theme.palette.background.paper,
  },
  toolbar: {
    minHeight: 64,
    display: 'flex',
    width: '100%',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  logo: {
    width: 18,
    height: 18,
    marginRight: theme.spacing(1),
  },
}));

function TopBar() {
  const styles = useStyles();

  return (
    <AppBar className={styles.appBar} elevation={2}>
      <Toolbar disableGutters className={styles.toolbar}>
        {/* <Hidden lgUp>
          <IconButton className={classes.menuButton} color="inherit">
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
          <Box flexGrow={1} />
        </Hidden> */}
        {/* <Hidden mdDown>
          <RouterLink className={classes.logo} to="/"></RouterLink>
          
        </Hidden> */}
        <Box ml={3} flexGrow={1} flexShrink={1} display="flex" alignItems="center">
          {/* <Logo className={styles.logo} />
          <Typography color="textPrimary" variant="h4">
            网欣云运维平台
          </Typography> */}
        </Box>
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
