import { Box, IconButton, InputBase, makeStyles, Tooltip, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { TABS_HEIGHT } from '../[name]';
import { Scrollbars } from 'react-custom-scrollbars';
import Color from 'color';
import { THEME } from '@/constants';
import * as monaco from 'monaco-editor';
import { useModel } from 'umi';
import clsx from 'clsx';
import { searchFileContent } from '../utils';
import { useThrottleFn } from 'ahooks';
import Monaco, { getEditor } from './Monaco';

const useStyles = makeStyles(theme => ({
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
        ? Color(theme.palette.background.paper)
            .darken(0.2)
            .hex()
            .toString()
        : Color(theme.palette.background.paper)
            .lighten(0.5)
            .hex()
            .toString(),
  },
  search: {
    background: Color(theme.palette.background['dark'])
      .darken(0.1)
      .hex()
      .toString(),
    display: 'flex',
    alignItems: 'center',
    padding: 2,
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontSize: 14,
  },
  active: {
    border: `1px solid ${theme.palette.divider}`,
  },
  loadIcon: {
    display: 'none',
  },
  iconButton: {
    marginRight: 4,
    flexShrink: 0,
    '& .codicon': {
      color: theme.palette.text.secondary,
      fontSize: '18px!important',
    },
  },
  checked: {
    backgroundColor: theme.palette.action.hover,
    '& .codicon': {
      color: theme.palette.text.primary,
    },
  },
  resultArea: {},
  resultAreaHeader: {},
}));

export default ({ name, files }) => {
  const styles = useStyles();
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadIconRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const {
    ret,
    setRet,
    searchString,
    setSearchString,
    caseSensitive,
    setCaseSensitive,
    wholeWord,
    setWholeWord,
    preserveCase,
    setPreserveCase,
    filesToInclude,
    setFilesToInclude,
    filesToExclude,
    setFilesToExclude,
  } = useModel('useFileSearch');

  const { run: search } = useThrottleFn(
    () => {
      searchFileContent(
        searchString,
        caseSensitive,
        wholeWord,
        filesToInclude,
        filesToExclude,
        name,
        files,
      ).then(ret => {
        setRet(
          ret.map(i => {
            const lines = [];
            for (const range of i.matches) {
              try {
                const content = monaco.editor
                  .getModel(monaco.Uri.file(i.filepath))
                  .getLineContent(range.range.startLineNumber);
                lines.push(content);
              } catch (error) {
                console.log(error);
                continue;
              }
            }
            return {
              filepath: i.filepath,
              lines,
            };
          }),
        );
      });
    },
    { wait: 1000, leading: false, trailing: true },
  );

  useEffect(() => {
    monaco.editor.create(loadIconRef.current);
    setScrollHeight(scrollRef.current?.clientHeight);
  }, []);

  useEffect(() => {
    if (!searchString) return;
    search();
  }, [searchString, filesToExclude, filesToInclude]);

  const replace = () => {};

  const replaceAll = () => {};

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <div ref={el => (loadIconRef.current = el)} className={styles.loadIcon}></div>
      <Box className={styles.bar1}>文件搜索</Box>
      <Box className={styles.search} mx={1}>
        <InputBase
          value={searchString}
          className={styles.searchInput}
          placeholder="搜索"
          onChange={e => setSearchString(e.target.value)}
        />
        <Tooltip title="匹配大小写">
          <IconButton
            size="small"
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={clsx(styles.iconButton, caseSensitive && styles.checked)}
          >
            <Box className="codicon codicon-case-sensitive" />
          </IconButton>
        </Tooltip>
        <Tooltip title="匹配单词">
          <IconButton
            size="small"
            onClick={() => setWholeWord(!wholeWord)}
            className={clsx(styles.iconButton, wholeWord && styles.checked)}
          >
            <Box className="codicon codicon-whole-word" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box display="flex" mt={1} mx={1} alignItems="center">
        <Box className={styles.search} flex={1} mr={1}>
          <InputBase className={styles.searchInput} placeholder="替换" />{' '}
          <Tooltip title="保留大小写">
            <IconButton
              size="small"
              onClick={() => setPreserveCase(!preserveCase)}
              className={clsx(styles.iconButton, preserveCase && styles.checked)}
            >
              <Box className="codicon codicon-preserve-case" />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title="全部替换">
          <IconButton size="small" onClick={replaceAll} className={clsx(styles.iconButton)}>
            <Box className="codicon codicon-find-replace-all" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box className={styles.search} mx={1} mt={1}>
        <InputBase
          value={filesToInclude}
          className={styles.searchInput}
          placeholder="指定文件或文件夹"
          onChange={e => setFilesToInclude(e.target.value)}
        />
      </Box>
      <Box className={styles.search} mx={1} mt={1}>
        <InputBase
          value={filesToExclude}
          className={styles.searchInput}
          placeholder="排除文件或文件夹"
          onChange={e => setFilesToExclude(e.target.value)}
        />
      </Box>
      {ret && ret.length > 0 && (
        <Box mx={2} my={1}>
          <Typography variant="body2" color="textSecondary">
            共 {ret.map(i => i.lines.length).reduce((a, b) => a + b)} 个结果在 {ret.length} 个文件中
          </Typography>
        </Box>
      )}

      <div ref={el => (scrollRef.current = el)} className={styles.scroll}>
        <Scrollbars
          autoHide
          style={{ height: scrollHeight }}
          renderThumbVertical={props => <div className={styles.thumb} {...props} />}
        >
          {ret && ret.map(item => <ResultArea key={item.filepath} item={item} />)}
          <Box height={100} />
        </Scrollbars>
      </div>
    </Box>
  );
};

function ResultArea({ item }) {
  const styles = useStyles();
  return (
    <div className={styles.resultArea}>
      <div className={styles.resultAreaHeader}>
        {item.filepath.substring(item.filepath.lastIndexOf('/'))}
      </div>
    </div>
  );
}
