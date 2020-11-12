import React from 'react';
import * as monaco from 'monaco-editor';
import { withStyles } from '@material-ui/core';
import LightningFS from '@isomorphic-git/lightning-fs';
const fs = new LightningFS('fs');
import { THEME } from '@/constants';
import wxConfirm from '@/components/WxConfirm';
import prettier from 'prettier/standalone';
import parseTypescript from 'prettier/parser-typescript';

const styles = {
  editor: {
    width: '100%',
    height: '100%',
  },
};

let myEditor: monaco.editor.IStandaloneCodeEditor = null;

export function getEditor() {
  return myEditor;
}

interface IState {
  editor: monaco.editor.IStandaloneCodeEditor;
  originalValues: { item: string; value: string }[];
}

class Monaco extends React.Component<any, IState> {
  ref: HTMLDivElement;

  state: IState = {
    editor: null,
    originalValues: [],
  };

  async componentDidMount() {
    window.onbeforeunload = () => {
      if (this.props.unsavedItems.length > 0) {
        return 'leave';
      }
    };

    const { theme } = this.props;
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
    const model = await this.getModel();
    const editor = monaco.editor.create(this.ref, {
      lineNumbers: 'on',
      fontSize: 18,
      lineHeight: 28,
      wordWrap: 'wordWrapColumn',
      wordWrapColumn: 100,
      wordWrapMinified: true,
      wrappingIndent: 'indent',
    });
    model && editor.setModel(model);
    editor.onDidChangeModelContent(this.onContentChanged);
    // 关闭
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KEY_W, () =>
      this.onCloseTab(),
    );
    // 关闭全部
    editor.addCommand(
      monaco.KeyMod.chord(
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KEY_K,
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KEY_W,
      ),
      () => this.onCloseAllTabs(),
    );
    // 保存文件
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KEY_S, () =>
      this.onSaveItem(),
    );
    // 保存全部文件
    editor.addCommand(
      monaco.KeyMod.chord(
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KEY_K,
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KEY_S,
      ),
      () => this.onSaveAllItems(),
    );
    // 代码编辑
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KEY_F, () =>
      this.onFormatCode(),
    );
    myEditor = editor;
    this.setState({ editor });
  }

  async componentDidUpdate(prevProps) {
    const { focusItem, name } = this.props;
    if (focusItem !== prevProps.focusItem && name) {
      const model = await this.getModel();
      this.state.editor.setModel(model);
    }
  }

  componentWillUnmount() {
    this.state.editor?.dispose();
  }

  getModel = async () => {
    const { focusItem, name } = this.props;
    if (!focusItem) return;
    const data = await fs.promises.readFile('/' + name + focusItem, { encoding: 'utf8' });
    const originalModel = monaco.editor.getModel(monaco.Uri.file('/' + name + focusItem));
    if (!originalModel) {
      this.setState({
        originalValues: [...this.state.originalValues, { item: focusItem, value: data }],
      });
    }
    return (
      originalModel ||
      monaco.editor.createModel(data, undefined, monaco.Uri.file('/' + name + focusItem))
    );
  };

  onFormatCode = () => {
    const { focusItem } = this.props;
    const { editor } = this.state;
    const fileExt = focusItem.substring(focusItem.lastIndexOf('.') + 1);

    const ret = prettier.format(
      editor.getValue(),
      fileExt === 'ts' || fileExt === 'tsx'
        ? {
            parser: 'typescript',
            plugins: [parseTypescript],
            singleQuote: true,
            trailingComma: 'all',
            printWidth: 100,
          }
        : {
            singleQuote: true,
            trailingComma: 'all',
            printWidth: 100,
          },
    );
    if (ret !== editor.getValue()) {
      const position = editor.getPosition();
      editor.getModel().setValue(ret);
      editor.setPosition(position);
    }
  };

  onContentChanged = () => {
    const { focusItem, setUnsavedItems, unsavedItems } = this.props;
    const { editor, originalValues } = this.state;
    if (editor.getValue() !== originalValues.find((i) => i.item === focusItem)?.value) {
      if (!unsavedItems.some((i) => i === focusItem)) {
        setUnsavedItems([...unsavedItems, focusItem]);
      }
    } else {
      if (unsavedItems.some((i) => i === focusItem)) {
        setUnsavedItems(unsavedItems.filter((i) => i !== focusItem));
      }
    }
  };

  onSaveItem = async (item?: string) => {
    const { focusItem, name, unsavedItems, setUnsavedItems } = this.props;
    item = item || focusItem;
    await fs.promises.writeFile('/' + name + item, this.state.editor.getValue(), {
      encoding: 'utf8',
    });
    if (unsavedItems.some((i) => i === item)) {
      setUnsavedItems(unsavedItems.filter((i) => i !== item));

      this.setState({
        originalValues: this.state.originalValues.map((i) => {
          if (i.item === item) {
            i.value = this.state.editor.getValue();
          }
          return i;
        }),
      });
    }
  };

  onSaveAllItems = async () => {
    const { unsavedItems, name, setUnsavedItems } = this.props;
    const promises = [];
    for (const item of unsavedItems) {
      promises.push(
        fs.promises.writeFile(
          '/' + name + item,
          monaco.editor.getModel(monaco.Uri.file('/' + name + item)).getValue(),
          {
            encoding: 'utf8',
          },
        ),
      );
    }
    await Promise.all(promises);
    setUnsavedItems([]);
    this.setState({
      originalValues: [],
    });
  };

  onCloseTab = (item?: string) => {
    const {
      openItems,
      setFocusItem,
      unsavedItems,
      setUnsavedItems,
      focusItem,
      setOpenItems,
      name,
    } = this.props;
    item = item || focusItem;
    const close = () => {
      const items = openItems.filter((j) => j.path !== item);
      setFocusItem(items[items.length - 1]?.path);
      setOpenItems([...items]);

      if (unsavedItems.some((i) => i === item)) {
        setUnsavedItems(unsavedItems.filter((i) => i !== item));
        this.setState({
          originalValues: this.state.originalValues.filter((i) => i.item !== item),
        });
      }
    };
    if (unsavedItems.some((i) => i === item)) {
      wxConfirm({
        title: '保存文件',
        message: '您的更改会丢失如果不进行保存',
        nuetralText: '不保存',
        confirmText: '保存',
        cancelText: '取消',
        onConfirm: () => {
          // 保存
          this.onSaveItem(item);
          close();
        },
        onNuetral: () => {
          // 不保存
          monaco.editor.getModel(monaco.Uri.file('/' + name + focusItem)).dispose();
          close();
        },
      });
    } else {
      close();
    }
  };

  onCloseAllTabs = () => {
    const { setFocusItem, unsavedItems, setUnsavedItems, setOpenItems } = this.props;
    const closeAll = () => {
      setFocusItem(null);
      setOpenItems([]);
      setUnsavedItems([]);
      this.setState({
        originalValues: [],
      });
    };
    if (unsavedItems.length > 0) {
      wxConfirm({
        title: '保存文件',
        message: '您的更改会丢失如果不进行保存',
        nuetralText: '不保存',
        confirmText: '保存',
        cancelText: '取消',
        onConfirm: async () => {
          // 保存
          await this.onSaveAllItems();
          closeAll();
          return true;
        },
        onNuetral: () => {
          monaco.editor.getModels().forEach((model) => model.dispose());
          closeAll();
        },
      });
    } else {
      closeAll();
    }
  };

  render() {
    const { classes } = this.props;
    return <div ref={(el) => (this.ref = el)} className={classes.editor}></div>;
  }
}

export default withStyles(styles, { withTheme: true })(Monaco);
