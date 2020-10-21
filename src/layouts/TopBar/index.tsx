import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Box, Toolbar, makeStyles } from '@material-ui/core';
import Account from './Account';
import { SIDEBAR_WIDTH } from '../Sidebar';

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
        <Box ml={3} flexGrow={1} flexShrink={1} display="flex" alignItems="center"></Box>
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
