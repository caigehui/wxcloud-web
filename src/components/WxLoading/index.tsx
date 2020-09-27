import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@material-ui/core';

interface ILoadingProps {
  loading: boolean;
  message?: React.ReactNode;
}

function WxLoading({ loading, message }: ILoadingProps) {
  return (
    <Backdrop style={{ zIndex: 9999 }} open={loading}>
      <CircularProgress color="primary" />
      <Box ml={2}>
        <Typography variant="h3" color="textPrimary">
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
}

export default WxLoading;
