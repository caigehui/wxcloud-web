import React from 'react';
import { MenuItem, TextField } from '@material-ui/core';

function LevelPicker({ value, onChange }) {
  return (
    <TextField
      select
      label="日志等级"
      style={{ width: 100 }}
      value={value}
      onChange={e => onChange(e.target.value)}
      variant="outlined"
      margin="dense"
    >
      <MenuItem value="all">all</MenuItem>
      <MenuItem value="info">info</MenuItem>
      <MenuItem value="warn">warn</MenuItem>
      <MenuItem value="error">error</MenuItem>
    </TextField>
  );
}

export default LevelPicker;
