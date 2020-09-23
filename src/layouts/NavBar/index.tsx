/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  ListSubheader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import NavItem from './NavItem';
import { useModel } from 'umi';

function renderNavItems({ items, pathname, parentKey, ...rest }) {
  return (
    <List disablePadding>
      {items?.reduce?.(
        (acc, item) => reduceChildRoutes({ acc, item, pathname, parentKey, ...rest }),
        [],
      )}
    </List>
  );
}

function reduceChildRoutes({ acc, parentKey, pathname, item, depth = 0 }) {
  if (item.children) {
    const open = matchPath(pathname, {
      path: item.key,
      exact: false,
    });

    acc.push(
      <NavItem
        path={parentKey + '/' + item.key}
        depth={depth}
        icon={item.icon}
        key={item.key}
        open={Boolean(open) || item.open}
        name={item.name}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          parentKey: parentKey + '/' + item.key,
          items: item.children,
        })}
      </NavItem>,
    );
  } else {
    acc.push(
      <NavItem
        key={item.key}
        depth={depth}
        path={parentKey + '/' + item.key}
        icon={item.icon}
        name={item.name}
      />,
    );
  }

  return acc;
}

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
}));

function NavBar({ openMobile, onMobileClose }) {
  const classes = useStyles();
  const location = useLocation();
  const { user, menu } = useModel('useAuthModel');

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box overflow="auto" height="100%" display="flex" flexDirection="column">
      <Hidden lgUp>
        <Box p={2} display="flex" justifyContent="center">
          <RouterLink to="/"></RouterLink>
        </Box>
      </Hidden>
      <Box p={2}>
        <Box display="flex" justifyContent="center">
          <RouterLink to="/app/account">
            <Avatar alt="User" className={classes.avatar} src="" />
          </RouterLink>
        </Box>
        <Box mt={2} textAlign="center">
          <Link
            component={RouterLink}
            to="/app/account"
            variant="h5"
            color="textPrimary"
            underline="none"
          >
            {`${user?.nickname}`}
          </Link>
          <Typography variant="body2" color="textSecondary">
            介绍
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box p={2}>
        <List
          subheader={
            <ListSubheader disableGutters disableSticky>
              菜单
            </ListSubheader>
          }
        >
          {renderNavItems({
            items: menu,
            parentKey: '',
            pathname: location.pathname,
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer anchor="left" classes={{ paper: classes.desktopDrawer }} open variant="persistent">
          {content}
        </Drawer>
      </Hidden>
    </>
  );
}

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default NavBar;
