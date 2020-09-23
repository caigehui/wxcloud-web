import React, { useState } from 'react';
import { useWxApi } from '@wxsoft/wxcomponents';
import {
  Box,
  makeStyles,
  Grid,
  Paper,
  Typography,
  Drawer,
  Hidden,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { Menu, ExpandMore } from '@material-ui/icons';
import { useSessionStorageState } from 'ahooks';
import Sidebar from './components/Sidebar';
import Api from './components/Api';
import { WxDevelopApi } from '@wxapi/wxeap-admin';

function ApiDoc() {
  const { data } = useWxApi(WxDevelopApi.getApiControllers);
  const styles = useStyles();
  const [openKeys, setOpenKeys] = useSessionStorageState('apidoc_openKeys', []);
  const [current, setCurrent] = useSessionStorageState('apidoc_current', null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleOpenKey = (name: string) => {
    if (openKeys.includes(name)) {
      setOpenKeys(openKeys.filter(i => i !== name));
    } else {
      setOpenKeys([...openKeys, name]);
    }
  };

  return (
    <Grid container direction="row" className={styles.container}>
      <Hidden smDown>
        <Grid item className={styles.sidebar} component={Paper}>
          <Sidebar
            current={current}
            setCurrent={setCurrent}
            data={data}
            toggleOpenKey={toggleOpenKey}
            openKeys={openKeys}
          />
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          classes={{
            paper: styles.drawerMobilePaper,
          }}
          style={{ position: 'absolute', zIndex: 1301 }}
          BackdropProps={{ classes: { root: styles.drawerMobileBackdrop } }}
        >
          <Sidebar
            current={current}
            setCurrent={current => {
              setCurrent(current);
              setSidebarOpen(false);
            }}
            data={data}
            toggleOpenKey={toggleOpenKey}
            openKeys={openKeys}
          />
        </Drawer>
      </Hidden>
      <Grid item xs style={{ height: '100%', overflowY: 'auto' }}>
        {current ? (
          <Box p={4} className={styles.inner}>
            <Hidden mdUp>
              <IconButton onClick={() => setSidebarOpen(true)}>
                <Menu />
              </IconButton>
            </Hidden>
            {current.properties.map(item => (
              <Accordion key={item.name} style={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h4" color="textPrimary">
                    {item.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Api
                    key={item.name}
                    item={item}
                    root={current?.root}
                    controller={current.name.replace('Controller', '')}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Box flex={1} p={3}>
            <Typography color="textPrimary" variant="h3">
              请选择Controller
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
  },
  sidebar: {
    width: 250,
    height: '100%',
  },
  drawerDesktopRoot: {
    position: 'absolute',
    width: 280,
    zIndex: 9999,
  },
  drawerMobilePaper: {
    position: 'relative',
    width: 280,
  },
  drawerMobileBackdrop: {
    position: 'absolute',
  },
  inner: {
    backgroundColor: theme.palette.background['dark'],
  },
}));

export default ApiDoc;
