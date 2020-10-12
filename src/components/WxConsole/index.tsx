import React, { createRef, useState } from 'react';
import { Paper } from '@material-ui/core';
import { Terminal } from 'xterm';
import { useMount } from 'ahooks';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

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
    initMessage && term.writeln(initMessage);
  });

  return (
    <Paper style={{ height: '100%', width: '100%' }}>
      <div style={{ height: '100%', width: '100%' }} ref={ref} />
    </Paper>
  );
}

function arePropsEqual(prevProps: WxConsoleProps, nextProps: WxConsoleProps) {
  return true;
}

export default React.memo(React.forwardRef(WxConsole), arePropsEqual);
