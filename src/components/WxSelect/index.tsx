import React, { useState, useRef, useImperativeHandle } from 'react';
import { TextField, TextFieldProps, MenuItem, Menu, useTheme, Box } from '@material-ui/core';
import flatten from 'lodash/flatten';
import { flatChildren } from '@/utils';
import ArrowRight from '@material-ui/icons/ArrowRight';

interface WxSelectOption {
  label?: string;
  value: string;
  children?: Array<WxSelectOption>;
  parent?: string;
}

export type WxSelectProps = {
  options: Array<WxSelectOption>;
};

interface NestedItemProps {
  label: string;
  options: Array<WxSelectOption>;
  handleItemClick: (value: any) => void;
}

function WxSelect({ options, onChange, defaultValue, ...rest }: WxSelectProps & TextFieldProps) {
  const [value, setValue] = useState(defaultValue || '');
  const [open, setOpen] = useState(false);

  const handleItemClick = value => {
    setValue(value);
    setOpen(false);
    onChange(value);
  };

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <TextField
      select
      SelectProps={{
        open,
        onOpen,
        MenuProps: { onClose },
        renderValue: value => value,
      }}
      value={value}
      {...rest}
    >
      {options.map(item => {
        if (item.children) {
          return (
            <NestedItem
              label={item.label || item.value}
              options={item.children}
              key={item.value}
              handleItemClick={handleItemClick}
            />
          );
        } else {
          return (
            <MenuItem key={item.value} onClick={() => handleItemClick(item.value)}>
              {item.label || item.value}
            </MenuItem>
          );
        }
      })}
      {flatChildren(options).map(item => (
        <MenuItem key={item.value} value={item.value} style={{ display: 'none' }} />
      ))}
    </TextField>
  );
}

const NestedItem = React.forwardRef<HTMLLIElement | null, NestedItemProps>(
  ({ options, label, handleItemClick }: NestedItemProps, ref) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const menuItemRef = useRef<any>(null);
    useImperativeHandle(ref, () => menuItemRef.current);

    return (
      <MenuItem
        ref={menuItemRef}
        value={flatten(options).map(i => i.value)}
        style={{
          backgroundColor: open ? theme.palette.action.hover : 'transparent',
        }}
        onClick={() => setOpen(!open)}
        onMouseLeave={() => {
          setOpen(false);
        }}
        onMouseEnter={() => {
          setOpen(true);
        }}
      >
        <Box width="100%" display="flex" alignItems="center">
          <Box flex={1}>{label}</Box>
          <ArrowRight fontSize="small" />
        </Box>
        <Menu
          style={{ pointerEvents: 'none', overflow: 'none' }}
          open={open}
          onClose={() => setOpen(false)}
          anchorEl={menuItemRef.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
        >
          <div style={{ pointerEvents: 'auto' }}>
            {options.map(item => {
              if (item.children) {
                return (
                  <NestedItem
                    key={item.value}
                    label={item.label || item.value}
                    options={item.children}
                    handleItemClick={handleItemClick}
                  />
                );
              } else {
                return (
                  <MenuItem key={item.value} onClick={() => handleItemClick(item.value)}>
                    {item.label || item.value}
                  </MenuItem>
                );
              }
            })}
          </div>
        </Menu>
      </MenuItem>
    );
  },
);

export default WxSelect;
