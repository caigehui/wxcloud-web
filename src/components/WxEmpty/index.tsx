import React from 'react';
import { Box, Typography } from '@material-ui/core';
import FolderOpen from '@material-ui/icons/FolderOpen';

interface WxEmptyProps {
  title: string;
  icon?: React.ReactNode;
}

function WxEmpty({ title, icon }: WxEmptyProps) {
  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
      fontSize={64}
      flexDirection="column"
    >
      <Box>{icon ? icon : <FolderOpen color="primary" fontSize="inherit" />}</Box>
      <Typography variant="h3" color="textSecondary">
        {title}
      </Typography>
    </Box>
  );
}

export default WxEmpty;
