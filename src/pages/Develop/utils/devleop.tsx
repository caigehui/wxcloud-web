import React, { useEffect } from 'react';
// import { STRING_EXCLUSIVELY_RULES } from '@/constants';
import { Checkbox, TextField, useTheme, MenuItem, Box } from '@material-ui/core';
import { EditComponentProps } from 'material-table';
import ReactJson from 'react-json-view';
import { DateTimePicker, LocalizationProvider } from '@material-ui/pickers';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import day from 'dayjs';
import { THEME } from '@/constants';

export function validateVarName(name: string, names: string[]) {
  if (!name) return false;
  if (names.filter(i => i === name).length > 1)
    return {
      isValid: false,
      helperText: '名字重复',
    };
  if (!/^[a-z][A-Za-z]*$/.test(name)) {
    return {
      isValid: false,
      helperText: '必须是小写开头的英文',
    };
  }

  // 判断是否为保留字符
  let reservedWord = false;
  try {
    eval('var ' + name + ' = 1');
  } catch {
    reservedWord = true;
  }
  if (reservedWord) {
    return {
      isValid: false,
      helperText: '不能设为JS保留字符',
    };
  }
  return true;
}

// /**
//  * 判断排他字段
//  * @param ruleName
//  * @param rowData
//  */
// export function setExclusiveRule(ruleName: string, rowData) {
//   if (!rowData.columnRule) rowData.columnRule = {};
//   rowData.columnRule[ruleName] = !rowData?.columnRule[ruleName];

//   // 排他
//   if (STRING_EXCLUSIVELY_RULES.some(i => i === ruleName) && rowData?.columnRule[ruleName]) {
//     for (const key in rowData?.columnRule || {}) {
//       if (
//         key !== ruleName &&
//         STRING_EXCLUSIVELY_RULES.some(i => i === key) &&
//         rowData?.columnRule[key]
//       ) {
//         rowData.columnRule[key] = false;
//       }
//     }
//   }
//   return { ...rowData };
// }

/**
 * 排他Checkbox组件
 * @param props
 */
export function ExclusiveCheckbox(props: EditComponentProps<any>) {
  return (
    <Checkbox
      style={{ padding: 0 }}
      checked={!!props.value}
      onChange={() => props.onRowDataChange(setExclusiveRule(props.columnDef.title, props.rowData))}
    />
  );
}

export function DefaultValueField(props: EditComponentProps<any>) {
  const theme = useTheme();
  useEffect(() => {
    if (
      /Object/.test(props.rowData.type) &&
      (typeof props.value !== 'object' || props.value === null)
    )
      props.onChange({});
    if (/Array/.test(props.rowData.type) && !Array.isArray(props.value)) props.onChange([]);
    if (props.rowData.type === 'boolean' && typeof props.value !== 'boolean') props.onChange(false);
    if (props.rowData.type === 'Date' && !day(props.value).isValid()) props.onChange(null);
  }, [props.rowData.type]);

  if (props.rowData.type === 'number ' || props.rowData.type === 'string') {
    return (
      <TextField
        value={props.value}
        placeholder="填写默认值"
        onChange={e => {
          const value = e.target.value;
          if (props.rowData.type === 'number') {
            props.onChange(parseFloat(value));
          } else {
            props.onChange(value);
          }
        }}
        type={props.rowData.type === 'number' ? 'number' : 'text'}
        InputProps={{
          style: {
            fontSize: 13,
          },
        }}
      />
    );
  } else if (props.rowData.type === 'boolean') {
    return (
      <Checkbox
        style={{ padding: 0 }}
        checked={!!props.value}
        onChange={() => props.onChange(!props.value)}
      />
    );
  } else if (/Object|Array/.test(props.rowData.type)) {
    return (
      <ReactJson
        style={{ padding: 16, borderRadius: 4, width: 300 }}
        theme={theme['name'] === THEME.LIGHT ? 'rjv-default' : 'google'}
        src={typeof props.value !== 'object' ? {} : props.value}
        onAdd={({ updated_src }) => props.onChange(updated_src)}
        onDelete={({ updated_src }) => props.onChange(updated_src)}
        onEdit={({ updated_src }) => props.onChange(updated_src)}
      />
    );
  } else if (/Date/.test(props.rowData.type)) {
    return (
      // @ts-ignore
      <LocalizationProvider dateAdapter={DateFnsAdapter}>
        <DateTimePicker
          renderInput={props => (
            <TextField
              style={{ width: 200 }}
              margin="dense"
              placeholder="选择日期时间"
              {...props}
            />
          )}
          value={props.value}
          onChange={props.onChange}
        />
      </LocalizationProvider>
    );
  } else {
    return null;
  }
}

export const BASE_TYPE = [
  'string',
  'boolean',
  'number',
  'Array',
  'Object',
  'Date',
  'File',
  'GeoPoint',
  'Pointer',
  'Relation',
];

export const getTypeOptions = (entityNames: string[]) => {
  const recurse = (types: string[], parent?: string) => {
    return types.map(i => {
      if (i === 'Array') {
        return {
          value: i,
          label: i,
          children: recurse(['any', ...types.filter(i => i !== 'Array')], i),
        };
      } else if (i === 'Pointer' || i === 'Relation') {
        return {
          value: i,
          label: i,
          children: recurse(entityNames, parent ? `${parent}<${i}>` : i),
        };
      } else {
        return {
          value: parent
            ? parent.indexOf('<') > -1
              ? `${parent.substring(0, parent.length - 1)}<${i}>>`
              : `${parent}<${i}>`
            : i,
          label: i,
        };
      }
    });
  };
  return recurse(BASE_TYPE);
};

export function LevelPicker({ value, onChange }: any) {
  return (
    <TextField
      select
      label="日志等级"
      style={{ width: 100 }}
      value={value}
      onChange={e => onChange(e.target.value)}
      variant="outlined"
      margin="dense"
    >
      <MenuItem value="all">all</MenuItem>
      <MenuItem value="info">info</MenuItem>
      <MenuItem value="warn">warn</MenuItem>
      <MenuItem value="error">error</MenuItem>
    </TextField>
  );
}

export function JSONViewer({ src }: any) {
  const theme = useTheme();
  return (
    <Box maxHeight={150} overflow="auto" color={theme.palette.text.primary}>
      {JSON.stringify(src)}
    </Box>
  );
}
