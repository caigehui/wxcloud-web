import React, { useMemo, MouseEvent } from 'react';
import { Typography, Box, Grid, Breadcrumbs, Button } from '@material-ui/core';
import { useLocation } from 'react-router';
import { getMenuItemNameByKey } from '@/utils';
import NavigateNext from '@material-ui/icons/NavigateNext';

interface WxPageProps {
  menu: Array<any>;
  children?: React.ReactNode;
  title?: string;
  buttonTitle?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: (event: MouseEvent) => void;
  buttonDiabled?: boolean;
  renderRight?: React.ReactNode;
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
}: WxPageProps) {
  const location = useLocation();
  const paths = useMemo(() => {
    return location.pathname.split('/');
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
    <Box display="flex" p={4} flexDirection="column" height="100%">
      <Grid component={Box} container>
        <Grid item xs={12} md={10} lg={8}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            {paths.map((key, index) => {
              return (
                <Typography
                  key={index}
                  color={index === paths.length - 1 ? 'textPrimary' : 'inherit'}
                >
                  {getMenuItemNameByKey(key, menu)}
                </Typography>
              );
            })}
          </Breadcrumbs>
          <Box mt={1}>
            <Typography variant="h3" color="textPrimary">
              {title || getMenuItemNameByKey(paths[paths.length - 1], menu)}
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
      <Box flex={1} mt={3}>
        {children}
      </Box>
    </Box>
  );
}

export default WxPage;
