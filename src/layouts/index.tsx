import React, { useState } from 'react';
import { IRouteComponentProps, useModel, Redirect } from 'umi';
import { makeStyles } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { Helmet } from 'react-helmet';
import { getMenuItemNameByKey } from '@/utils';
import last from 'lodash/last';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background['dark'],
    display: 'flex',
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
      paddingLeft: 256,
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
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  if (user) {
    return (
      <div className={classes.root}>
        <Helmet>
          <title>
            {getMenuItemNameByKey(last(location.pathname.split('/')), menu) || ''} - WxEAP
          </title>
        </Helmet>
        <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
        <NavBar onMobileClose={() => setMobileNavOpen(false)} openMobile={isMobileNavOpen} />
        <div className={classes.wrapper}>
          <div className={classes.contentContainer}>
            <div className={classes.content}>{React.cloneElement(children, { menu })}</div>
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
