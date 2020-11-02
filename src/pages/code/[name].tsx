import { Box, makeStyles, SvgIcon, Typography, useTheme } from '@material-ui/core';
import React, { useState } from 'react';
import { File, GitBranch } from 'react-feather';
import clsx from 'clsx';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as Docker } from '@/assets/docker.svg';
import { Container, Section, Bar } from 'react-simple-resizer';
import FileExplorer from './components/FileExplorer';

const useStyles = makeStyles(theme => ({
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    transition: '.3s all',
    cursor: 'pointer',
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.secondary,
    '&:hover': {
      background: theme.palette.action.hover,
    },
    marginBottom: theme.spacing(1),
  },
  menuItemActived: {
    background: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
  menuIcon: {
    width: 28,
    height: 28,
  },
}));

export default ({ location }) => {
  const styles = useStyles();
  const theme = useTheme();
  const [activedIndex, setActivedIndex] = useState(0);

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Box px={2} height={36} width="100%" display="flex" alignItems="center">
        <Logo width={24} height={24} />
        <Box ml={3}>
          <Typography color="textSecondary" variant="body2">
            文件
          </Typography>
        </Box>
        <Box ml={2}>
          <Typography color="textSecondary" variant="body2">
            编辑
          </Typography>
        </Box>
        <Box ml={2}>
          <Typography color="textSecondary" variant="body2">
            视图
          </Typography>
        </Box>
        <Typography
          style={{
            top: 6,
            position: 'absolute',
            left: '50%',
            transform: 'translate(-60%, 0)',
          }}
          variant="body1"
          color="textSecondary"
        >
          {location.pathname.replace('/code/', '')} - wxcloud studio
        </Typography>
      </Box>
      <Box display="flex" width="100%" height="100%">
        <Box display="flex" flexDirection="column" width={56} height="100%" alignItems="center">
          <Box
            onClick={() => setActivedIndex(0)}
            className={clsx(styles.menuItem, activedIndex === 0 && styles.menuItemActived)}
          >
            <SvgIcon className={styles.menuIcon} color="inherit">
              <File />
            </SvgIcon>
          </Box>
          <Box
            onClick={() => setActivedIndex(1)}
            className={clsx(styles.menuItem, activedIndex === 1 && styles.menuItemActived)}
          >
            <SvgIcon className={styles.menuIcon} color="inherit">
              <GitBranch />
            </SvgIcon>
          </Box>
          <Box
            onClick={() => setActivedIndex(2)}
            className={clsx(styles.menuItem, activedIndex === 2 && styles.menuItemActived)}
          >
            <SvgIcon className={styles.menuIcon} color="inherit">
              <Docker width={28} height={28} />
            </SvgIcon>
          </Box>
        </Box>
        <Container style={{ height: '100%', flex: 1 }}>
          <Section
            style={{ background: theme.palette.background['dark'] }}
            defaultSize={250}
            minSize={150}
          >
            {(() => {
              switch (activedIndex) {
                case 0:
                  return <FileExplorer />;
              }
            })()}
          </Section>
          <Bar size={10} style={{ background: 'transparent', cursor: 'col-resize' }} />
          <Section
            style={{ background: theme.palette.background.default, flex: 1 }}
            minSize={600}
          />
        </Container>
      </Box>
    </Box>
  );
};
