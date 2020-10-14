import React from 'react';
import { IRouteComponentProps, useModel, Redirect } from 'umi';
import { makeStyles } from '@material-ui/core';
import TopBar from './TopBar';
import { Helmet } from 'react-helmet';
import { getMenuItemNameByKey } from '@/utils';
import last from 'lodash/last';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import Register from './Register';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background['dark'],
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: SIDEBAR_WIDTH,
    },
  },
  contentContainer: {
    display: 'flex',
    flex: '1',
    overflow: 'hidden',
  },
  content: {
    flex: '1',
    height: '100%',
    overflow: 'auto',
  },
}));

const FREE_LOCATION = ['/', '/logout'];

export default function Layout({ children, location }: IRouteComponentProps) {
  if (location.pathname === '/login') return children;
  const classes = useStyles();
  const { user, menu } = useModel('useAuthModel');
  if (user) {
    return (
      <div className={classes.root}>
        <Helmet>
          <title>
            {getMenuItemNameByKey(last(location.pathname.split('/')), menu) || ''} - 网欣云
          </title>
        </Helmet>
        <TopBar />
        <Sidebar />
        <div className={classes.wrapper}>
          <div className={classes.contentContainer}>
            <div className={classes.content}>
              {(() => {
                if (location.pathname.startsWith('/register/')) {
                  return <Register menu={menu}>{children}</Register>;
                } else {
                  return React.cloneElement(children, { menu });
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <Redirect
        to={
          FREE_LOCATION.some(i => i === location.pathname.toLowerCase())
            ? '/login'
            : `/login?returnUrl=${encodeURIComponent(location.pathname)}`
        }
      />
    );
  }
}
