import React from 'react';
import * as monaco from 'monaco-editor';
import { withStyles } from '@material-ui/core';
import LightningFS from '@isomorphic-git/lightning-fs';
const fs = new LightningFS('fs');
import { THEME } from '@/constants';

const styles = {
  editor: {
    width: '100%',
    height: '100%',
  },
};

class Monaco extends React.Component<any> {
  ref: HTMLDivElement;

  state = {
    editor: null,
  };

  async componentDidMount() {
    const { theme, focusItem, name } = this.props;
    monaco.editor.defineTheme('dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', background: theme.palette.background.paper },
        { token: 'comment', foreground: '#7f848e' },
        { token: 'keyword', fontStyle: 'bold', foreground: '#61AFEF' },
        { token: 'type', foreground: '#E06C75' },
        { token: 'string', foreground: '#98C379' },
        { token: 'invalid', foreground: '#7f848e' },
      ],
      colors: {
        background: theme.palette.background.paper,
        'editor.background': theme.palette.background.paper,
      },
    });
    monaco.editor.defineTheme('light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: '', background: theme.palette.background.paper },
        { token: 'comment', foreground: '#7f848e' },
        { token: 'keyword', fontStyle: 'bold', foreground: '#A626A4' },
        { token: 'type', foreground: '#0184BC' },
        { token: 'string', fontStyle: 'italic', foreground: '#50A14F' },
        { token: 'invalid', foreground: '#7f848e' },
      ],
      colors: {
        background: theme.palette.background.paper,
        'editor.background': theme.palette.background.paper,
      },
    });
    monaco.editor.setTheme(theme['name'] === THEME.LIGHT ? 'light' : 'dark');
    const data = await fs.promises.readFile('/' + name + focusItem, { encoding: 'utf8' });
    const model =
      monaco.editor.getModel(monaco.Uri.file(focusItem)) ||
      monaco.editor.createModel(data, undefined, monaco.Uri.file(focusItem));

    const editor = monaco.editor.create(this.ref, {
      lineNumbers: 'on',
      fontSize: 18,
      model,
      lineHeight: 28,
      wordWrap: 'wordWrapColumn',
      wordWrapColumn: 100,
      wordWrapMinified: true,
      wrappingIndent: 'indent',
      minimap: {},
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KEY_W, this.close);
    this.setState({ editor });
  }

  close = () => {
    const { openItems, setFocusItem, focusItem, setOpenItems } = this.props;
    const items = openItems.filter(j => j.path !== focusItem);
    setFocusItem(items[items.length - 1]?.path);
    setOpenItems([...items]);
  };

  async componentDidUpdate(prevProps) {
    const { focusItem, name } = this.props;
    if (focusItem !== prevProps.focusItem && name) {
      const data = await fs.promises.readFile('/' + name + focusItem, { encoding: 'utf8' });
      const model =
        monaco.editor.getModel(monaco.Uri.file(focusItem)) ||
        monaco.editor.createModel(data, undefined, monaco.Uri.file(focusItem));

      console.log(model);
      this.state.editor.setModel(model);
    }
  }

  componentWillUnmount() {
    this.state.editor?.dispose();
  }

  render() {
    const { classes } = this.props;
    return <div ref={el => (this.ref = el)} className={classes.editor}></div>;
  }
}

export default withStyles(styles, { withTheme: true })(Monaco);
