import * as monaco from 'monaco-editor';
import LightningFS from '@isomorphic-git/lightning-fs';
const fs = new LightningFS('fs');
import mime from 'mime';
import fileIcons from './fileIcons';

export interface Folder {
  name: string;
  path: string;
  children?: Array<Folder>;
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

export function getFileIcon(name: string) {
  if (!name) return 'file';
  return (
    fileIcons.icons?.find(
      j =>
        j.fileExtensions?.some(z => z === name.substring(name.lastIndexOf('.') + 1)) ||
        j.fileNames?.some(z => z === name),
    )?.name || 'file'
  );
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

// 获取文件大小
async function getFileStats(name: string, files: string[]) {
  const promises = [];
  for (const file of files) {
    const filepath = '/' + name + '/' + file;
    promises.push(fs.promises.stat(filepath));
  }
  const ret = await Promise.all(promises);
  return ret.map((i, index) => ({ stat: i, file: files[index] }));
}

function validateFile(filepath: string, filesToIncludeArr: string[], filesToExcludeArr: string[]) {
  // 没有在限定文件范围内，忽略
  if (
    filesToIncludeArr &&
    !filesToIncludeArr.some(i => filepath.split('/').some(j => j.trim() === i.trim()))
  ) {
    return false;
  }

  if (
    filesToExcludeArr &&
    filesToExcludeArr.some(i => filepath.split('/').some(j => j.trim() === i.trim()))
  ) {
    return false;
  }
  return true;
}

/**
 * 搜索文本
 * @param searchString 搜索文本
 * @param caseSensitive 大小写敏感
 * @param wholeWord 是否匹配单词
 * @param filesToInclude 限定搜索文件的范围
 * @param filesToExclude 排除搜索文件
 * @param name 工程名
 * @param files 所有文件名
 */
export async function searchFileContent(
  searchString: string,
  caseSensitive: boolean,
  wholeWord: boolean,
  filesToInclude: string,
  filesToExclude: string,
  name: string,
  files: string[],
): Promise<{ filepath: string; matches: monaco.editor.FindMatch[] }[]> {
  const fileStats = await getFileStats(name, files);
  // 已经打开的文件model
  const models = monaco.editor.getModels();
  const filesToIncludeArr = filesToInclude?.split(',').filter(i => i);
  const filesToExcludeArr = filesToExclude?.split(',').filter(i => i);

  const fileDataPromises = [];
  for (const [index, file] of files.entries()) {
    const filepath = '/' + name + '/' + file;

    // 文件太大，忽略
    if (fileStats[index].stat.size > 1048576) continue;
    // 文件是图片，忽略
    if (mime.getType(file)?.startsWith('image')) continue;
    // 文件已经有model，忽略
    if (models.some(i => i.uri.path === filepath)) continue;

    fileDataPromises.push({
      filepath,
      promise: fs.promises.readFile(filepath, {
        encoding: 'utf8',
      }),
    });
  }
  // 其他未打开的文件数据
  const fileData: string[] = await Promise.all(fileDataPromises.map(i => i.promise));
  // 查询结果
  const searchRet: { filepath: string; matches: monaco.editor.FindMatch[] }[] = [];
  // 先查寻已有model中的结果
  for (const model of models) {
    const matches = model.findMatches(
      searchString,
      true,
      false,
      caseSensitive,
      wholeWord ? '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?' : null,
      true,
    );
    const filepath = model.uri.path;
    if (!validateFile(filepath, filesToIncludeArr, filesToExcludeArr)) continue;
    if (matches.length > 0) {
      searchRet.push({ filepath: model.uri.path, matches });
    }
  }

  // 搜索其他model
  for (const [index, data] of fileData.entries()) {
    const filepath = fileDataPromises[index].filepath;
    const model =
      monaco.editor.getModel(filepath) ||
      monaco.editor.createModel(data, undefined, monaco.Uri.file(filepath));
    const matches = model.findMatches(
      searchString,
      true,
      false,
      caseSensitive,
      wholeWord ? '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?' : null,
      true,
    );
    if (!validateFile(filepath, filesToIncludeArr, filesToExcludeArr)) continue;
    if (matches.length > 0) {
      searchRet.push({ filepath, matches });
    }
  }

  // 然后查询
  return searchRet;
}
