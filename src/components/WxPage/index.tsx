import React, { useMemo, MouseEvent } from 'react';
import { Typography, Box, Grid, Breadcrumbs, Button, IconButton } from '@material-ui/core';
import { useLocation } from 'react-router';
import { getMenuItemNameByKey } from '@/utils';
import NavigateNext from '@material-ui/icons/NavigateNext';
import { ArrowBack } from '@material-ui/icons';
import { history } from 'umi';

interface WxPageProps {
  menu?: Array<any>;
  children?: React.ReactNode;
  title?: string;
  buttonTitle?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: (event: MouseEvent) => void;
  buttonDiabled?: boolean;
  renderRight?: React.ReactNode;
  showBackIcon?: boolean;
}

function WxPage({
  children,
  title,
  renderRight,
  buttonTitle,
  buttonIcon,
  menu,
  onButtonClick,
  buttonDiabled,
  showBackIcon,
}: WxPageProps) {
  const location = useLocation();
  const paths = useMemo(() => {
    return location.pathname.substr(1).split('/');
  }, [location.pathname]);

  const buttonEl = useMemo(() => {
    if (!renderRight && (!buttonTitle || !onButtonClick)) return null;
    return (
      renderRight || (
        <Button
          disabled={buttonDiabled}
          startIcon={buttonIcon}
          onClick={onButtonClick}
          color="primary"
          variant="contained"
        >
          {buttonTitle}
        </Button>
      )
    );
  }, [renderRight, buttonTitle, onButtonClick]);
  return (
    <Box display="flex" p={4} flexDirection="column" height="100%" overflow="auto">
      <Grid component={Box} container>
        <Grid item xs={12} md={10} lg={8}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <Typography color="inherit">总览</Typography>
            {menu ? (
              paths.map((key, index) => {
                const menuItemName = getMenuItemNameByKey(key, menu);
                return (
                  <Typography
                    key={index}
                    color={index === paths.length - 1 ? 'textPrimary' : 'inherit'}
                  >
                    {index === paths.length - 1 ? title || menuItemName : menuItemName}
                  </Typography>
                );
              })
            ) : (
              <Typography color="inherit">{title}</Typography>
            )}
          </Breadcrumbs>
          <Box mt={1}>
            <Typography variant="h2" color="textPrimary">
              <Box display="flex" alignItems="center">
                {showBackIcon && (
                  <IconButton color="inherit" onClick={history.goBack} size="small" style={{ marginRight: 16 }}>
                    <ArrowBack />
                  </IconButton>
                )}
                {title || getMenuItemNameByKey(paths[paths.length - 1], menu)}
              </Box>
            </Typography>
          </Box>
        </Grid>
        {buttonEl && (
          <Grid item xs={12} md={2} lg={4}>
            <Box p={1} display="flex" justifyContent="flex-end">
              {buttonEl}
            </Box>
          </Grid>
        )}
      </Grid>
      <Box flex={1} mt={3} height="100%">
        {children}
      </Box>
    </Box>
  );
}

export default WxPage;
