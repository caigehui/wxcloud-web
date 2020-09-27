import React from 'react';
import { CircularProgress, Box } from '@material-ui/core';

function WxDynamicLoading() {
  return (
    <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
      <CircularProgress color="primary" />
    </Box>
  );
}

export default WxDynamicLoading;
