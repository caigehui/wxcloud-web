import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Clear, Search } from '@material-ui/icons';
import React from 'react';

function WxSearchField({ value, onChange, label, ...restProps }) {
  return (
    <TextField
      InputProps={{
        style: { paddingRight: 0 },
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: value?.length > 0 && (
          <InputAdornment position="end">
            <IconButton onClick={() => onChange('')}>
              <Clear fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      placeholder={'搜索' + label}
      variant="outlined"
      margin="dense"
      value={value}
      label={label}
      onChange={e => onChange(e.target.value)}
      {...restProps}
      style={Object.assign({ marginLeft: 16, width: 240 }, restProps.style)}
    />
  );
}

export default WxSearchField;
