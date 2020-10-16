import { Box, Drawer, makeStyles, SvgIcon, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory, useModel } from 'umi';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import * as Icon from 'react-feather';
import { Link } from 'umi';
import clsx from 'clsx';

export const SIDEBAR_WIDTH = 90;

const useStyles = makeStyles(theme => ({
  desktopDrawer: {
    width: SIDEBAR_WIDTH,
    top: 0,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  logo: {
    width: 52,
    height: 52,
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
    transition: '.3s all',
    cursor: 'pointer',
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.secondary,
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  menuItemActived: {
    background: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
  menuIcon: {
    width: 28,
    height: 28,
    marginBottom: theme.spacing(1),
  },
}));

export default () => {
  const { menu } = useModel('useAuthModel');
  const styles = useStyles();
  const {
    location: { pathname },
    push,
  } = useHistory();

  const firstRoute = pathname.split('/')[1];

  return (
    <Drawer variant="permanent" classes={{ paper: styles.desktopDrawer }}>
      <Link to="/dashboard">
        <Logo className={styles.logo} />
      </Link>
      {menu?.map((i: any) => {
        const ElIcon = Icon[i.icon];
        const isActived = firstRoute === i.key;
        return (
          <Box
            onClick={() => push(`/${i.key}`)}
            key={i.key}
            className={clsx(styles.menuItem, isActived && styles.menuItemActived)}
          >
            <SvgIcon className={styles.menuIcon} color="inherit">
              <ElIcon />
            </SvgIcon>
            <Typography color="inherit" variant="body1">
              {i.name}
            </Typography>
          </Box>
        );
      })}
    </Drawer>
  );
};
