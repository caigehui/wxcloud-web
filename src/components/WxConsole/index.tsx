import React, { createRef, useEffect, useState } from 'react';
import { Paper } from '@material-ui/core';
import { Terminal } from 'xterm';
import { useMount } from 'ahooks';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import isEqual from 'lodash/isEqual';

export interface WxConsoleProps {
  editable?: boolean;
  initMessage?: string;
}

function WxConsole({ editable, initMessage }: WxConsoleProps, external) {
  const ref = createRef<HTMLDivElement>();
  const [term, setTerm] = useState(null);
  const [fitAddon, setFitAddon] = useState(null);

  React.useImperativeHandle(external, () => ({
    write: (...args) => term.write(...args),
    writeln: (...args) => term.writeln(...args),
    fit: () => fitAddon?.fit(),
    clear: () => term.clear(),
  }));

  useMount(() => {
    const term = new Terminal({ disableStdin: !editable, cursorBlink: true });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(ref.current);
    setFitAddon(fitAddon);
    setTerm(term);
    fitAddon.fit();
  });

  useEffect(() => {
    term?.clear();
    initMessage && term?.writeln(initMessage);
  }, [initMessage]);

  return (
    <Paper style={{ height: '100%', width: '100%', backgroundColor: 'black', padding: 16 }}>
      <div style={{ height: '100%', width: '100%' }} ref={ref} />
    </Paper>
  );
}

function arePropsEqual(prevProps: WxConsoleProps, nextProps: WxConsoleProps) {
  return isEqual(prevProps, nextProps);
}

export default React.memo(React.forwardRef(WxConsole), arePropsEqual);
