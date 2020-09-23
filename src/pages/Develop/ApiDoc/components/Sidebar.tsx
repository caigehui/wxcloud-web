import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {
  Box,
  makeStyles,
  List,
  ListItem,
  ListSubheader,
  Button,
  Collapse,
} from '@material-ui/core';
import { Folder, Box as BoxIcon } from 'react-feather';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
  },
  sidebar: {
    width: 250,
    height: '100%',
  },
  item: {
    display: 'block',
    paddingTop: 0,
    paddingBottom: 0,
  },
  itemLeaf: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: theme.palette.text.secondary,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
  },
  buttonLeaf: {
    color: theme.palette.text.secondary,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightRegular,
    '&.depth-0': {
      '& $title': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  title: {
    marginRight: 'auto',
  },
  active: {
    color: theme.palette.secondary.main,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium,
    },
    '& $icon': {
      color: theme.palette.secondary.main,
    },
  },
}));

function Content({ item, root, openKeys, current, setCurrent, toggleOpenKey, depth }: any) {
  const styles = useStyles();
  return item.children ? (
    <ListItem key={item.name} disableGutters className={styles.item}>
      <Button
        style={{ marginLeft: depth * 8 }}
        className={styles.button}
        onClick={() => toggleOpenKey(item.name)}
      >
        <Folder className={styles.icon} size="20" />
        <span className={styles.title}>{item.name}</span>
        {!!openKeys.includes(item.name) ? (
          <ExpandLessIcon color="inherit" />
        ) : (
          <ExpandMoreIcon color="inherit" />
        )}
      </Button>
      <Collapse in={!!openKeys.includes(item.name)}>
        <List disablePadding>
          {item?.children?.map(child => (
            <Content
              key={child.name}
              current={current}
              root={root}
              setCurrent={setCurrent}
              item={child}
              openKeys={openKeys}
              depth={depth + 1}
              toggleOpenKey={toggleOpenKey}
            />
          ))}
        </List>
      </Collapse>
    </ListItem>
  ) : (
    <ListItem key={item.name} className={styles.itemLeaf} disableGutters>
      <Button
        style={{ marginLeft: depth * 8 }}
        onClick={() => {
          item.root = root;
          setCurrent(item);
        }}
        className={clsx(styles.buttonLeaf, current?.name === item.name && styles.active)}
      >
        <BoxIcon className={styles.icon} size="20" />
        <span className={styles.title}>{item.name}</span>
      </Button>
    </ListItem>
  );
}

function Sidebar({ data, current, setCurrent, openKeys, toggleOpenKey }: any) {
  return (
    <Box p={2} height="100%" overflow="auto">
      <List
        subheader={
          <ListSubheader disableGutters disableSticky>
            Api接口列表
          </ListSubheader>
        }
      >
        {data?.map?.(item => (
          <Content
            depth={0}
            root={item.name}
            key={item.name}
            current={current}
            setCurrent={setCurrent}
            openKeys={openKeys}
            toggleOpenKey={toggleOpenKey}
            item={item}
          />
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;
