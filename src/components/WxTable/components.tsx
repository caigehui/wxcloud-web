import React from 'react';
import { Box } from '@material-ui/core';
import { MTableAction, MTableActions } from 'material-table';

const components = {
  Actions: props => (
    <Box display="flex" justifyContent="center" flex={1}>
      <MTableActions {...props} />
    </Box>
  ),
  Action: (props: any) => (
    <MTableAction {...props} size={props.action?.isFreeAction ? 'medium' : 'small'} />
  ),
};

export default components;
