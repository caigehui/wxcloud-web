import { useState } from 'react';

export default function useFileSearch() {
  const [ret, setRet] = useState(null);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [preserveCase, setPreserveCase] = useState(false);
  const [searchString, setSearchString] = useState<string>();
  const [filesToInclude, setFilesToInclude] = useState(null);
  const [filesToExclude, setFilesToExclude] = useState(null);
  const [hideItems, setHideItems] = useState([]);
  const [replaceString, setReplaceString] = useState(null);

  return {
    ret,
    setRet,
    caseSensitive,
    setCaseSensitive,
    wholeWord,
    setWholeWord,
    preserveCase,
    setPreserveCase,
    searchString,
    setSearchString,
    filesToInclude,
    setFilesToInclude,
    filesToExclude,
    setFilesToExclude,
    hideItems,
    setHideItems,
    replaceString,
    setReplaceString,
  };
}
