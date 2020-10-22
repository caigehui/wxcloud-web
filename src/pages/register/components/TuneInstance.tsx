import { Box, Button, CircularProgress, IconButton, Slider, Typography } from '@material-ui/core';
import { Tune } from '@material-ui/icons';
import { useRequest } from 'ahooks';
import React from 'react';
import { buildRequest } from '../utils';
import Popover from '@material-ui/core/Popover';

export default ({ rowData, state, cpu }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState(0);

  const { data: instances, run, loading } = useRequest(
    () =>
      buildRequest(state, {
        url: '/WxMicro/getPM2Instances',
        params: { containerId: rowData.Id },
      }),
    {
      manual: true,
      initialData: 'init',
      formatResult: data => data.data,
    },
  );

  const { run: submit } = useRequest(
    () =>
      buildRequest(state, {
        url: '/WxMicro/setPM2Instances',
        method: 'POST',
        data: { containerId: rowData.Id, instances: value },
      }),
    {
      manual: true,
    },
  );

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
    run();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = async () => {
    submit();
    handleClose();
  };

  // 必须是正在运行中的wxsoft容器才能调节pm2实例数
  if (!rowData.Labels.wxsoft || rowData.State !== 'running') return null;

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <Tune />
      </IconButton>
      <Popover
        open={anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box py={2} px={4} width={400} alignItems="center" display="flex" flexDirection="column">
          {loading || !cpu ? (
            <CircularProgress color="primary" />
          ) : (
            <>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography>实例数</Typography>
                <Button variant="contained" size="small" color="primary" onClick={onSubmit}>
                  确定
                </Button>
              </Box>
              <Slider
                onChange={(e, value) => setValue(value as number)}
                defaultValue={instances}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={cpu?.cores}
              />
            </>
          )}
        </Box>
      </Popover>
    </Box>
  );
};
