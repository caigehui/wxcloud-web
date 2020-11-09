import { Box, makeStyles, useTheme } from '@material-ui/core';
import React, { useRef } from 'react';
import { TABS_HEIGHT } from '../[name]';
import { Scrollbars } from 'react-custom-scrollbars';
import color from 'color';
import { THEME } from '@/constants';
import Monaco from './Monaco';
import { ReactComponent as LogoLight } from '@/assets/logo-light.svg';
import { ReactComponent as LogoDark } from '@/assets/logo-dark.svg';
import TabItem from './TabItem';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tabs: {
    height: TABS_HEIGHT,
    flexShrink: 0,

    display: 'flex',
  },
  thumb: {
    cursor: 'pointer',
    borderRadius: 'inherit',
    height: '4px!important',
    marginTop: 2,
    backgroundColor:
      theme['name'] === THEME.LIGHT
        ? color(theme.palette.background.paper)
            .darken(0.2)
            .hex()
            .toString()
        : color(theme.palette.background.paper)
            .lighten(0.5)
            .hex()
            .toString(),
  },
}));

export default ({ focusItem, name, setFocusItem, openItems, width, setOpenItems }) => {
  const styles = useStyles();
  const theme = useTheme();
  const scrollRef = useRef(null);

  return (
    <Box className={styles.container} width={width}>
      <Scrollbars
        ref={el => (scrollRef.current = el)}
        autoHide
        style={{
          width,
          height: TABS_HEIGHT,
          flexShrink: 0,
          backgroundColor: theme.palette.background['dark'],
        }}
        renderThumbHorizontal={props => <Box className={styles.thumb} {...props} />}
      >
        <div
          className={styles.tabs}
          onWheel={e => {
            scrollRef.current?.scrollLeft(scrollRef.current?.getScrollLeft() + e.deltaY);
          }}
        >
          {openItems.map(item => {
            return (
              <TabItem
                key={item.path}
                openItems={openItems}
                setOpenItems={setOpenItems}
                focusItem={focusItem}
                setFocusItem={setFocusItem}
                item={item}
                scrollRef={scrollRef}
                width={width}
              />
            );
          })}
        </div>
      </Scrollbars>
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        {focusItem ? (
          <Monaco
            focusItem={focusItem}
            name={name}
            setFocusItem={setFocusItem}
            openItems={openItems}
            setOpenItems={setOpenItems}
          />
        ) : theme['name'] === THEME.LIGHT ? (
          <LogoLight />
        ) : (
          <LogoDark />
        )}
      </Box>
    </Box>
  );
};
