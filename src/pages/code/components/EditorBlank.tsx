import { THEME } from '@/constants';
import { Box, Chip, Typography, useTheme } from '@material-ui/core';
import React from 'react';
import { ReactComponent as LogoLight } from '@/assets/logo-light.svg';
import { ReactComponent as LogoDark } from '@/assets/logo-dark.svg';

const items = [
  { label: '保存文件', command: ['ctrl', 'alt', 's'] },
  { label: '保存全部文件', command: ['ctrl', 'alt', 'k', 's'] },
  { label: '关闭标签页', command: ['ctrl', 'alt', 'w'] },
  { label: '关闭全部标签页', command: ['ctrl', 'alt', 'k', 'w'] },
];

export default ({}) => {
  const theme = useTheme();
  return (
    <>
      {theme['name'] === THEME.LIGHT ? (
        <LogoLight width={256} height={256} />
      ) : (
        <LogoDark width={256} height={256} />
      )}
      {items.map((item, index) => (
        <Box mt={1} key={index} display="flex" width={512} alignItems="center">
          <Box flex={1} mr={2}>
            <Typography style={{ textAlign: 'right' }} variant="body2" color="textSecondary">
              {item.label}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography color="textSecondary">
              {item.command.map((j, index) => (
                <>
                  <Chip label={j} key={index} />{' '}
                  {`${index === item.command.length - 1 ? '' : ` + `}`}
                </>
              ))}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
};
