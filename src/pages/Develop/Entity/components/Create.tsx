import React, { useEffect, useState } from 'react';
import { DialogContentText, TextField, Button, Grid, Box, useTheme } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import {
  validateVarName,
  ExclusiveCheckbox,
  getTypeOptions,
  DefaultValueField,
} from '../../utils/devleop';
import { READONLY_ENTITIES } from '@/constants';
import { EditComponentProps } from 'material-table';
import { requestWxApi } from '@wxsoft/wxcomponents';
import { WxDevelopApi } from '@wxapi/wxeap-admin';
import { WxDialog, WxSelect, WxTable } from '@wxsoft/wxcomponents';

export interface CreateProps {
  current: any;
  onClose: any;
  entityNames: string[];
}

interface FormData {
  name: string;
  dir: string;
  cname: string;
  note: string;
  updatedAt: string;
  updatedBy: string;
}

function Create({ current, onClose, entityNames }: CreateProps) {
  const [properties, setProperties] = useState([]);
  const isNew = current?.isNew;
  const theme = useTheme();

  const defaultValues = {
    name: current?.name,
    cname: current?.cname,
    dir: current?.dir,
    note: current?.note,
  };

  const { handleSubmit, errors, control, reset } = useForm<FormData>({
    mode: 'onChange',
  });

  const submit = handleSubmit(data => {
    onClose();
    return requestWxApi(WxDevelopApi.saveEntity({ ...data, properties }));
  });

  useEffect(() => {
    setProperties(current?.properties || []);
    reset(defaultValues);
  }, [current]);

  return (
    <WxDialog
      width="lg"
      open={!!current}
      onClose={onClose}
      titleIcon={<Edit />}
      title={`${isNew ? '新增' : '修改'} Entity`}
      actions={
        <React.Fragment>
          <Box color={theme.palette.text.hint}>
            <Button onClick={onClose} color="inherit">
              取消
            </Button>
          </Box>
          <Button
            onClick={submit}
            disabled={READONLY_ENTITIES.some(i => i === current?.name)}
            color="primary"
          >
            确定
          </Button>
        </React.Fragment>
      }
    >
      <DialogContentText>基本信息</DialogContentText>
      <Grid container spacing={2}>
        <Grid item xs>
          <Controller
            name="name"
            as={TextField}
            margin="dense"
            control={control}
            helperText={errors?.name?.message}
            error={!!errors.name}
            rules={{
              required: true,
              pattern: { value: /^Wx[a-zA-z]+$/, message: '请以Wx开头命名' },
            }}
            fullWidth
            required
            label="Entity name"
            variant="outlined"
            disabled={!isNew}
          />
        </Grid>
        <Grid item xs>
          <Controller
            name="dir"
            margin="dense"
            as={TextField}
            control={control}
            helperText={errors?.dir?.message}
            error={!!errors.dir}
            rules={{
              required: true,
              pattern: { value: /^\/[a-zA-z\/]+$/, message: '请输入正确的目录名，例如/WxDevelop' },
            }}
            required
            fullWidth
            id="dir"
            label="目录"
            variant="outlined"
            disabled={!isNew}
          />
        </Grid>
        <Grid item xs>
          <Controller
            name="cname"
            margin="dense"
            as={TextField}
            control={control}
            rules={{
              required: true,
            }}
            required
            fullWidth
            id="cname"
            label="中文名"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="note"
            margin="dense"
            as={TextField}
            control={control}
            fullWidth
            multiline
            rowsMax={3}
            id="note"
            label="说明和备注"
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Box mt={2} width="100%" height={500} display="flex" flexDirection="row">
        <WxTable
          readonly={READONLY_ENTITIES.some(i => i === current?.name)}
          title="属性列表"
          insertable={{
            onUpdate: newData => setProperties(newData),
          }}
          sortable={{
            onSort: (rowData: any, index: number, type: 'up' | 'down', newData: Array<any>) =>
              setProperties(newData),
          }}
          deletable={rowData => ({
            confirmOptions: {
              title: `删除${rowData.name}`,
              message: `确定要删除${rowData.name}吗？删除后不会移除数据库对应的Column，如果需要请手动去数据库删除该Column。`,
              onConfirm: () => {
                setProperties(properties.filter(i => i !== rowData));
              },
            },
          })}
          options={{ search: false, paging: false }}
          columns={[
            {
              title: 'name*',
              field: 'name',
              validate: rowData =>
                validateVarName(
                  rowData.name,
                  properties.map(i => i.name),
                ),
            },
            {
              title: 'cname*',
              field: 'columnRule.name',
              validate: rowData => {
                if (!rowData?.columnRule?.name) return false;
                return true;
              },
            },
            {
              title: 'type*',
              field: 'type',
              width: 100,
              initialEditValue: 'string',
              validate: rowData => {
                if (!rowData.type) return false;
                return true;
              },
              editComponent: (props: EditComponentProps<any>) => (
                <WxSelect
                  error={props.error}
                  onChange={value => {
                    props.rowData.type = value;
                    delete props.rowData?.columnRule?.defaultValue;
                    props.onRowDataChange({ ...props.rowData });
                  }}
                  margin="dense"
                  placeholder="type"
                  InputProps={{ style: { minWidth: 100, fontSize: 13 } }}
                  options={getTypeOptions(entityNames || [])}
                  defaultValue={props.rowData.type}
                />
              ),
            },
            {
              title: 'description',
              field: 'columnRule.description',
            },
            {
              title: 'required',
              field: 'columnRule.required',
              type: 'boolean',
            },
            {
              title: 'unique',
              field: 'columnRule.unique',
              type: 'boolean',
              editable: (columnDef, rowData) => {
                return /^string|number|Date/.test(rowData.type);
              },
            },
            {
              title: 'oneOf',
              field: 'columnRule.oneOf',
              width: 150,
              editable: (columnDef, rowData) => {
                return /^string|number/.test(rowData.type);
              },
              validate: rowData => {
                if (!rowData.columnRule.oneOf) return true;
                if (typeof rowData.columnRule.oneOf !== 'string') return false;
                try {
                  const ret: Array<any> = JSON.parse(rowData.columnRule.oneOf);
                  if (!Array.isArray(ret)) return false;
                  for (const i of ret) {
                    if (typeof i !== rowData.type) return false;
                  }
                  return true;
                } catch (error) {
                  return false;
                }
              },
            },
            {
              title: 'defaultValue',
              field: 'columnRule.defaultValue',
              editable: (columnDef, rowData) => {
                return !/^Pointer|Relation|File|GeoPoint/.test(rowData.type);
              },
              editComponent: DefaultValueField,
              render: (data: any) => {
                if (typeof data?.columnRule?.defaultValue === 'object') {
                  return JSON.stringify(data.columnRule.defaultValue);
                } else if (typeof data?.columnRule?.defaultValue === 'boolean') {
                  return data?.columnRule?.defaultValue ? 'true' : 'false';
                } else {
                  return data?.columnRule?.defaultValue;
                }
              },
            },
            {
              title: 'immutable',
              field: 'columnRule.immutable',
              type: 'boolean',
            },
            {
              title: 'max',
              field: 'columnRule.max',
              type: 'numeric',
              editable: (columnDef, rowData) => {
                return rowData.type === 'number';
              },
            },
            {
              title: 'min',
              field: 'columnRule.min',
              type: 'numeric',
              editable: (columnDef, rowData) => rowData.type === 'number',
            },
            {
              title: 'maxLength',
              field: 'columnRule.maxLength',
              type: 'numeric',
              editable: (columnDef, rowData) =>
                rowData.type === 'Array' || rowData.type === 'string',
            },
            {
              title: 'minLength',
              field: 'columnRule.minLength',
              type: 'numeric',
              editable: (columnDef, rowData) =>
                rowData.type === 'Array' || rowData.type === 'string',
            },
            {
              title: 'isPhoneNumber',
              field: 'columnRule.isPhoneNumber',
              type: 'boolean',
              editable: (columnDef, rowData) => rowData.type === 'string',
              editComponent: ExclusiveCheckbox,
            },
            {
              title: 'isEmail',
              field: 'columnRule.isEmail',
              type: 'boolean',
              editable: (columnDef, rowData) => rowData.type === 'string',
              editComponent: ExclusiveCheckbox,
            },
          ]}
          data={properties}
        />
      </Box>
    </WxDialog>
  );
}

export default Create;
