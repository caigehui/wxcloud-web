import React, { useState, useEffect } from 'react';
import { TextField, Box, MenuItem } from '@material-ui/core';
import Api from '../../ApiDoc/components/Api';
import { WxEmpty } from '@wxsoft/wxcomponents';

function Test({ tab, current }: any) {
  const [item, setItem] = useState<any>(current.properties?.[0]);
  useEffect(() => {
    setItem(current.properties?.[0]);
  }, [current]);

  return tab === 'Test' ? (
    <Box display="flex" flexDirection="column">
      <TextField
        select
        fullWidth
        label="接口"
        variant="outlined"
        margin="dense"
        value={item.name}
        onChange={e => setItem(current.properties.find(i => i.name === e.target.value))}
      >
        {current?.properties?.map(i => (
          <MenuItem key={i.name} value={i.name}>
            {i.name}
          </MenuItem>
        ))}
      </TextField>
      {item ? (
        <Api item={item} controller={current.name.replace('Controller', '')} />
      ) : (
        <WxEmpty title="请选择接口" />
      )}
    </Box>
  ) : null;
}

export default Test;
