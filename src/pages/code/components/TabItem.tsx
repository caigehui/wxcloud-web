import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { fileIcons } from '../utils/fileIcons';
import { Close } from '@material-ui/icons';
import { makeStyles, Tooltip } from '@material-ui/core';
import Color from 'color';

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
    },
  },
  close: {
    transition: '.2s',
    opacity: 0,
    height: 18,
    width: 18,
    marginLeft: 6,
    flexShrink: 0,
    '&:active': {
      transform: 'scale(1.3)',
    },
  },
  tabActive: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    '& $close': {
      opacity: 1,
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

export default ({ setFocusItem, focusItem, setOpenItems, openItems, item, scrollRef, width }) => {
  const styles = useStyles();
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (focusItem === item.path) {
      if (ref.current?.offsetLeft > width + scrollRef.current?.getScrollLeft?.()) {
        scrollRef.current?.scrollLeft(ref.current?.offsetLeft - width / 2);
      } else if (ref.current?.offsetLeft < scrollRef.current?.getScrollLeft?.()) {
        scrollRef.current?.scrollLeft(ref.current?.offsetLeft - width / 2);
      }
    }
  }, [focusItem]);

  const iconName =
    fileIcons.icons.find(
      j =>
        j.fileExtensions?.some(z => z === item.name.substring(item.name.lastIndexOf('.') + 1)) ||
        j.fileNames?.some(z => z === item.name),
    )?.name || 'file';
  const hasSameName = openItems.some(j => j !== item && j.name === item.name);

  const close = e => {
    e.stopPropagation();
    const items = openItems.filter(j => j.path !== item.path);
    setFocusItem(items[items.length - 1]?.path);
    setOpenItems([...items]);
  };

  const jump = () => {
    if (item.path !== focusItem) {
      setFocusItem(item.path);
    }
  };

  return (
    <div
      ref={el => (ref.current = el)}
      className={clsx(styles.tab, item.path === focusItem && styles.tabActive)}
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
      <Close className={styles.close} onClick={close} />
    </div>
  );
};
