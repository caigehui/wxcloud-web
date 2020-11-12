import React, { useEffect, useRef, useState } from 'react';
import { Box, makeStyles, useTheme } from '@material-ui/core';
import color from 'color';
import { Folder, getFileIcon, makeDirectory } from '../utils';
import { ExpandMore, FolderOpen, KeyboardArrowRight } from '@material-ui/icons';
import { useLocalStorageState } from 'ahooks';
import { Scrollbars } from 'react-custom-scrollbars';
import folderIcons from '../utils/folderIcons';
import { THEME } from '@/constants';
import { TABS_HEIGHT } from '../[name]';
import { useModel } from 'umi';

const useStyles = makeStyles((theme) => ({
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
    backgroundColor: theme.palette.background.paper,
  },
  area: {
    display: 'flex',
    color: theme.palette.text.primary,
    alignItems: 'center',
    cursor: 'pointer',
    paddingTop: 1,
    paddingBottom: 1,
    '&:hover': {
      backgroundColor: color(theme.palette.background.paper).lighten(0.1).hex().toString(),
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
    height: TABS_HEIGHT,
    lineHeight: `${TABS_HEIGHT}px`,
    paddingLeft: theme.spacing(2),
  },
  bar2: {
    overflow: 'hidden',
    color: theme.palette.text.primary,
    height: 28,
    lineHeight: '28px',
    background: theme.palette.background.paper,
    paddingLeft: theme.spacing(2),
    fontSize: 16,
    boxShadow: '0px 6px 8px 1px rgba(0,0,0,0.1)',
  },
  scroll: {
    flex: 1,
  },
  thumb: {
    cursor: 'pointer',
    borderRadius: 'inherit',
    backgroundColor:
      theme['name'] === THEME.LIGHT
        ? color(theme.palette.background.paper).darken(0.2).hex().toString()
        : color(theme.palette.background.paper).lighten(0.5).hex().toString(),
  },
}));

const Area = ({
  folder,
  focusItem,
  setFocusItem,
  openFolders,
  setOpenFolders,
  openItems,
  setOpenItems,
  depth,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <Box className={styles.container}>
      {depth > 0 && <Box className={styles.divider} ml={`${16 + depth * 12}px`} />}
      {folder.children.map((i: Folder, index) => {
        const isFolder = !!i.children;
        const opened = openFolders.some((j) => j === i.path);

        const onClick = () => {
          if (isFolder) {
            if (opened) {
              setOpenFolders(openFolders.filter((j) => j !== i.path));
            } else {
              setOpenFolders([...openFolders, i.path]);
            }
          } else {
            setFocusItem(i.path);
            if (!openItems.some((j) => j.path === i.path)) {
              setOpenItems([...openItems, { name: i.name, path: i.path }]);
            }
          }
        };

        const iconName = isFolder
          ? folderIcons[0]?.icons?.find((j) => j.folderNames?.some((z) => i.name === z))?.name ||
            `folder${opened ? '-open' : ''}`
          : getFileIcon(i.name);

        return (
          <React.Fragment key={index}>
            <Box
              className={styles.area}
              bgcolor={
                focusItem === i.path
                  ? color(theme.palette.background.paper).darken(0.1).hex().toString()
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
                openItems={openItems}
                setOpenItems={setOpenItems}
                setOpenFolders={setOpenFolders}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default ({ files, name, focusItem, setFocusItem, openItems, setOpenItems }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const { user } = useModel('useAuthModel');
  const [folder, setFolder] = useLocalStorageState<Folder>(`${user.id}-${name}-folder`, null);
  // 文件浏览器展开的文件
  const [openFolders, setOpenFolders] = useLocalStorageState<string[]>(
    `${user.id}-${name}-open-folders`,
    [],
  );
  const styles = useStyles();

  useEffect(() => {
    if (files?.length > 0) {
      const init: Folder = { name: '', path: '', children: [] };
      makeDirectory(files, init);
      setFolder(init);
    }
  }, [files]);

  useEffect(() => {
    if (folder) {
      setScrollHeight(scrollRef.current?.clientHeight);
    }
  }, [folder]);

  if (!folder)
    return (
      <Box height="100%" width="100%" display="flex" alignItems="center" justifyContent="center">
        <FolderOpen style={{ width: 100, height: 100 }} color="secondary" />
      </Box>
    );

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <div className={styles.bar1}>文件目录</div>
      <div className={styles.bar2}>{name}</div>
      <div ref={(el) => (scrollRef.current = el)} className={styles.scroll}>
        <Scrollbars
          autoHide
          style={{ height: scrollHeight }}
          renderThumbVertical={(props) => <div className={styles.thumb} {...props} />}
        >
          <Area
            focusItem={focusItem}
            setFocusItem={setFocusItem}
            openFolders={openFolders}
            setOpenFolders={setOpenFolders}
            openItems={openItems}
            setOpenItems={setOpenItems}
            folder={folder}
            depth={0}
          />
          <Box height={100} />
        </Scrollbars>
      </div>
    </Box>
  );
};
