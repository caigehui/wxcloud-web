import React, { useEffect, useState } from 'react';
import LightningFS from '@isomorphic-git/lightning-fs';
import git from 'isomorphic-git';
import { Box, makeStyles, useTheme } from '@material-ui/core';
import color from 'color';
import { Folder, makeDirectory } from '../utils';
import { ExpandMore, FolderOpen, KeyboardArrowRight } from '@material-ui/icons';
import { useLocalStorageState } from 'ahooks';
import { folderIcons } from '../utils/folderIcons';
import { fileIcons } from '../utils/fileIcons';
const fs = new LightningFS('fs');

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
  },
  divider: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 1,
    backgroundColor: color(theme.palette.background.paper)
      .lighten(0.2)
      .hex()
      .toString(),
  },
  area: {
    display: 'flex',
    color: theme.palette.text.primary,
    alignItems: 'center',
    cursor: 'pointer',
    paddingTop: 1,
    paddingBottom: 1,
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  arrow: {
    width: 24,
    height: 24,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
    flexShrink: 0,
  },
  text: {
    fontSize: 15,
    userSelect: 'none',
    lineHeight: '25px',
    'white-space': 'nowrap',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
  },
  bar1: {
    color: theme.palette.text.primary,
    height: 32,
    lineHeight: '32px',
    paddingLeft: theme.spacing(2),
  },
  bar2: {
    color: theme.palette.text.primary,
    height: 28,
    lineHeight: '28px',
    background: theme.palette.background.paper,
    paddingLeft: theme.spacing(2),
    fontSize: 16,
    boxShadow: '0px 3px 8px 1px rgba(0,0,0,0.3)',
  },
}));

const Area = ({ folder, focusItem, setFocusItem, openFolders, setOpenFolders, depth }) => {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <Box className={styles.container}>
      {depth > 0 && <Box className={styles.divider} ml={`${16 + depth * 12}px`} />}
      {folder.children.map((i: Folder, index) => {
        const isFolder = !!i.children;
        const opened = openFolders.some(j => j === i.path);

        const onClick = () => {
          setFocusItem(i.path);
          if (isFolder) {
            if (opened) {
              setOpenFolders(openFolders.filter(j => j !== i.path));
            } else {
              setOpenFolders([...openFolders, i.path]);
            }
          }
        };

        const iconName = isFolder
          ? folderIcons[0].icons.find(j => j.folderNames?.some(z => i.name === z))?.name ||
            `folder${opened ? '-open' : ''}`
          : fileIcons.icons.find(
              j =>
                j.fileExtensions?.some(z => z === i.name.substring(i.name.lastIndexOf('.') + 1)) ||
                j.fileNames?.some(z => z === i.name),
            )?.name || 'file';

        return (
          <>
            <Box
              key={index}
              className={styles.area}
              bgcolor={
                focusItem === i.path
                  ? color(theme.palette.background.paper)
                      .darken(0.1)
                      .hex()
                      .toString()
                  : 'transparent'
              }
              pl={`${16 + depth * 12}px`}
              onClick={onClick}
            >
              <Box className={styles.arrow} flexShrink={0}>
                {isFolder ? opened ? <ExpandMore /> : <KeyboardArrowRight /> : null}
              </Box>
              <img className={styles.icon} src={`/public/icons/${iconName}.svg`} />
              <Box className={styles.text}>{i.name}</Box>
            </Box>
            {isFolder && opened && (
              <Area
                depth={depth + 1}
                folder={i}
                focusItem={focusItem}
                setFocusItem={setFocusItem}
                openFolders={openFolders}
                setOpenFolders={setOpenFolders}
              />
            )}
          </>
        );
      })}
    </Box>
  );
};

export default ({ ready, name }) => {
  const [folder, setFolder] = useState<Folder>(null);
  const [openFolders, setOpenFolders] = useLocalStorageState<string[]>(`${name}-open-folders`, []);
  const [focusItem, setFocusItem] = useState(null);
  const theme = useTheme();
  const styles = useStyles();

  useEffect(() => {
    if (ready) {
      git.listFiles({ fs, dir: '/' + name }).then(files => {
        const init: Folder = { name: '', path: '', children: [] };
        makeDirectory(files, init);
        setFolder(init);
        console.log(init);
      });
    }
  }, [ready]);

  if (!folder)
    return (
      <Box height="100%" width="100%" display="flex" alignItems="center" justifyContent="center">
        <FolderOpen style={{ width: 100, height: 100 }} color="secondary" />
      </Box>
    );

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box className={styles.bar1}>文件目录</Box>
      <Box className={styles.bar2}>{name}</Box>
      <Box overflow="auto" flex={1} paddingBottom="100px">
        <Area
          focusItem={focusItem}
          setFocusItem={setFocusItem}
          openFolders={openFolders}
          setOpenFolders={setOpenFolders}
          folder={folder}
          depth={0}
        />
      </Box>
    </Box>
  );
};
