import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Close } from '@material-ui/icons';
import { Box, makeStyles, Tooltip } from '@material-ui/core';
import Color from 'color';
import { getFileIcon } from '../utils';

const useStyles = makeStyles(theme => ({
  tab: {
    display: 'flex',
    borderRight: `1px solid ${Color(theme.palette.background.paper)
      .lighten(0.2)
      .hex()
      .toString()}`,
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    flexShrink: 0,
    minWidth: 150,
    cursor: 'pointer',
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: Color(theme.palette.background.paper)
        .lighten(0.1)
        .hex()
        .toString(),
      '& $close': {
        opacity: 1,
      },
      '& $unsaved': {
        opacity: 0,
      },
    },
  },
  close: {
    opacity: 0,
    height: 18,
    width: 18,
    marginLeft: 6,
    flexShrink: 0,
    position: 'relative',
    '&:active': {
      transform: 'scale(1.3)',
    },
  },
  unsaved: {
    opacity: 1,
    fontSize: 25,
    lineHeight: 25,
    flexShrink: 0,
    position: 'relative',
    marginLeft: 6,
    marginRight: -22,
    marginBottom: 6,
    '&:hover': {
      opacity: 0,
    },
  },
  tabActive: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    '& $close': {
      opacity: 1,
    },
  },
  tabUnsaved: {
    '& $close': {
      opacity: 0,
    },
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  path: {
    fontSize: 14,
    marginLeft: theme.spacing(1),
    color: Color(theme.palette.text.secondary)
      .darken(0.2)
      .hex()
      .toString(),
  },
}));

export default ({
  unsavedItems,
  setFocusItem,
  focusItem,
  openItems,
  item,
  scrollRef,
  width,
  editorRef,
}) => {
  const styles = useStyles();
  const ref = useRef<HTMLDivElement>();

  const unsave = unsavedItems.some(i => i === item.path);

  useEffect(() => {
    if (focusItem === item.path) {
      if (ref.current?.offsetLeft > width + scrollRef.current?.getScrollLeft?.()) {
        scrollRef.current?.scrollLeft(ref.current?.offsetLeft - width / 2);
      } else if (ref.current?.offsetLeft < scrollRef.current?.getScrollLeft?.()) {
        scrollRef.current?.scrollLeft(ref.current?.offsetLeft - width / 2);
      }
    }
  }, [focusItem]);
  const iconName = getFileIcon(item.name);
  const hasSameName = openItems.some(j => j !== item && j.name === item.name);

  const close = e => {
    e.stopPropagation();
    editorRef.current?.onCloseTab(item.path);
  };

  const jump = () => {
    if (item.path !== focusItem) {
      setFocusItem(item.path);
    }
  };
  return (
    <div
      ref={el => (ref.current = el)}
      className={clsx(
        styles.tab,
        item.path === focusItem && styles.tabActive,
        unsave && styles.tabUnsaved,
      )}
      onClick={jump}
    >
      <img className={styles.icon} src={`/public/icons/${iconName}.svg`} />
      <div className={styles.text}>{item.name}</div>
      {hasSameName && (
        <Tooltip enterDelay={500} title={item.path}>
          <div className={styles.path}>
            {(() => {
              const folderPath = item.path.replace('/' + item.name, '');
              return folderPath.substring(folderPath.lastIndexOf('/'));
            })()}
          </div>
        </Tooltip>
      )}
      {unsave && (
        <Box className={styles.unsaved} onClick={close}>
          ●
        </Box>
      )}
      <Close className={styles.close} onClick={close} />
    </div>
  );
};
