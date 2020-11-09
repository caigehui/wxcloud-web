import * as monaco from 'monaco-editor';

export interface Folder {
  name: string;
  path: string;
  children?: Array<Folder>;
}

export interface FolderIcon {
  /**
   * Name of the icon, e.g. 'src'
   */
  name: string;

  /**
   * Define the folder names that should apply the icon.
   * E.g. ['src', 'source']
   */
  folderNames: string[];

  /**
   * Define if there is a light icon available.
   */
  light?: boolean;

  /**
   * Define if there is a high contrast icon available.
   */
  highContrast?: boolean;

  /**
   * Define if the icon should be disabled.
   */
  disabled?: boolean;

  /**
   * Defines a pack to which this icon belongs. A pack can be toggled and all icons inside this pack can be enabled or disabled together.
   */
  enabledFor?: IconPack[];
}

export interface DefaultIcon {
  /**
   * Name of the icon, e.g. 'src'
   */
  name: string;

  /**
   * Define if there is a light icon available.
   */
  light?: boolean;

  /**
   * Define if there is a high contrast icon available.
   */
  highContrast?: boolean;
}

export interface FolderTheme {
  /**
   * Name of the theme
   */
  name: string;

  /**
   * Define the default icon for folders in a theme.
   */
  defaultIcon: DefaultIcon;

  /**
   * Icon for root folders.
   */
  rootFolder?: DefaultIcon;

  /**
   * Defines folder icons for specific folder names.
   */
  icons?: FolderIcon[];
}

export class FileIcons {
  /**
   * Define the default icon for folders.
   */
  defaultIcon: DefaultIcon;

  /**
   * Defines all folder icons.
   */
  icons?: FileIcon[];
}

export interface FileIcon {
  /**
   * Name of the icon, e.g. 'javascript'
   */
  name: string;

  /**
   * Define the file extensions that should use this icon.
   * E.g. ['js']
   */
  fileExtensions?: string[];

  /**
   * Define if there are some static file names that should apply this icon.
   * E.g. ['sample.js']
   */
  fileNames?: string[];

  /**
   * Define if there is a light icon available.
   */
  light?: boolean;

  /**
   * Define if there is a high contrast icon available.
   */
  highContrast?: boolean;

  /**
   * Define if the icon should be disabled.
   */
  disabled?: boolean;

  /**
   * Defines a pack to which this icon belongs. A pack can be toggled and all icons inside this pack can be enabled or disabled together.
   */
  enabledFor?: IconPack[];
}

/**
 * Defines icon packs that can be toggled.
 */
export enum IconPack {
  Angular = 'angular',
  Nest = 'nest',
  Ngrx = 'angular_ngrx',
  React = 'react',
  Redux = 'react_redux',
  Vue = 'vue',
  Vuex = 'vue_vuex',
}

export function makeDirectory(files: string[], ret: Folder) {
  const folders: { name: string; path: string; children: string[] }[] = [];
  const filesToBeAdd = [];

  for (const file of files) {
    if (file.indexOf('/') > -1) {
      const folder = file.substr(0, file.indexOf('/'));
      const childFile = file.substr(file.indexOf('/') + 1);
      if (folders.some(i => i.name === folder)) {
        folders.find(i => i.name === folder).children.push(childFile);
      } else {
        folders.push({ name: folder, path: ret.path + '/' + folder, children: [childFile] });
      }
    } else {
      // 文件直接加入
      filesToBeAdd.push({ name: file, path: ret.path + '/' + file });
    }
  }

  for (const item of folders) {
    const childRet = { name: item.name, path: item.path, children: [] };
    makeDirectory(item.children, childRet);
    ret.children.push(childRet);
  }
  ret.children.push(...filesToBeAdd);
}

const compilerDefaults = {
  jsx: monaco.languages.typescript.JsxEmit.React,
  target: monaco.languages.typescript.ScriptTarget.ES2018,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.CommonJS,
  experimentalDecorators: true,
  noEmit: true,
  allowJs: true,
  resolveJsonModule: true,
  allowSyntheticDefaultImports: true,
  emitDecoratorMetadata: true,
};

monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerDefaults);
monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerDefaults);

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: false,
});
