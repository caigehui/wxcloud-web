import {
  Box,
  List,
  ListItem,
  ListSubheader,
  makeStyles,
  Paper,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import * as Icon from 'react-feather';
import last from 'lodash/last';
import { Redirect, useHistory } from 'umi';

const useStyles = makeStyles(theme => ({
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
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
    width: 20,
    height: 20,
    marginRight: theme.spacing(1),
  },
  external: {
    width: 14,
    height: 14,
  },
  listItem: {
    padding: theme.spacing(0.5),
  },
}));

export default ({ children, menu }) => {
  const registerMenu = menu.find(i => i.key === 'register')?.children;
  const styles = useStyles();
  const history = useHistory();
  const pathname = last(history.location.pathname.split('/'));
  const state: any = history.location.state;

  const activePathname = registerMenu?.find(i => i.key === pathname)?.key;
  if (!activePathname) return <Redirect to="/register" />;

  return (
    <Box display="flex" height="100%">
      <Box component={props => <Paper {...props} elevation={0} />} height="100%" p={1} minWidth={180}>
        <List
          subheader={
            <ListSubheader disableGutters disableSticky>
              {state?.name}
            </ListSubheader>
          }
        >
          {registerMenu?.map(item => {
            const ElIcon = Icon[item.icon];
            const isActive = activePathname === item.key;
            return (
              <ListItem key={item.name} disableGutters className={styles.listItem}>
                <Box
                  onClick={() => {
                    if (item.key === 'database') {
                      window.open(state['url'] + '/wxeap-admin/dashboard/');
                    } else {
                      history.push('/register/' + item.key, history.location.state);
                    }
                  }}
                  className={clsx(styles.menuItem, isActive && styles.menuItemActived)}
                >
                  <SvgIcon className={styles.menuIcon} color="inherit">
                    <ElIcon />
                  </SvgIcon>
                  <Typography style={{ flex: 1 }} color="inherit" variant="body2">
                    {item.name}
                  </Typography>
                  {item.key === 'database' && (
                    <SvgIcon color="inherit" className={styles.external}>
                      <Icon.ExternalLink />
                    </SvgIcon>
                  )}
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box flex={1} height="100%">
        {React.cloneElement(children, { menu, state: history.location.state })}
      </Box>
    </Box>
  );
};
