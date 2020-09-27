import React from 'react';
import { Box, Paper, SvgIcon, Input, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  searchInput: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
  },
}));

function WxSearch() {
  const styles = useStyles();
  return (
    <Box
      component={Paper}
      display="flex"
      alignItems="center"
      py={0.5}
      px={1}
      {...({ variant: 'outlined' } as any)}
    >
      <SvgIcon color="action" fontSize="small">
        <SearchIcon />
      </SvgIcon>
      <Input className={styles.searchInput} disableUnderline placeholder="搜索" />
    </Box>
  );
}

export default WxSearch;
