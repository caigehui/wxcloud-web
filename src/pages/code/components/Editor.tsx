import { Box, makeStyles, useTheme } from '@material-ui/core';
import React, { useRef } from 'react';
import { TABS_HEIGHT } from '../[name]';
import { Scrollbars } from 'react-custom-scrollbars';
import color from 'color';
import { THEME } from '@/constants';
import Monaco from './Monaco';
import TabItem from './TabItem';
import EditorBlank from './EditorBlank';

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

export default ({
  focusItem,
  name,
  setFocusItem,
  openItems,
  width,
  setOpenItems,
  unsavedItems,
  setUnsavedItems,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const scrollRef = useRef(null);
  const editorRef = useRef(null);

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
                focusItem={focusItem}
                unsavedItems={unsavedItems}
                setFocusItem={setFocusItem}
                item={item}
                scrollRef={scrollRef}
                width={width}
                editorRef={editorRef}
              />
            );
          })}
        </div>
      </Scrollbars>
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {focusItem ? (
          <Monaco
            ref={el => (editorRef.current = el)}
            focusItem={focusItem}
            name={name}
            setFocusItem={setFocusItem}
            openItems={openItems}
            setOpenItems={setOpenItems}
            unsavedItems={unsavedItems}
            setUnsavedItems={setUnsavedItems}
          />
        ) : (
          <EditorBlank />
        )}
      </Box>
    </Box>
  );
};
