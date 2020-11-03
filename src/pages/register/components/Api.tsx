import React, { useState, useCallback, useEffect } from 'react';
import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
  TextField,
  useTheme,
} from '@material-ui/core';
import ReactJson from 'react-json-view';
import { THEME } from '@/constants';
import { useLocation } from 'umi';
import { buildRequest } from '../utils';

function getInitialEditSrc(parameters) {
  const src = {};
  for (const param of parameters) {
    src[param.name.replace('?', '')] = param.type;
  }
  return src;
}

export default function Api({ item, root, controller }: any) {
  const theme = useTheme();
  const location = useLocation();
  const [response, setResponse] = useState(null);
  const [useRaw, setUseRaw] = useState(false);
  const [raw, setRaw] = useState('');
  const [editSrc, setEditSrc] = useState(getInitialEditSrc(item.parameters));
  useEffect(() => {
    setRaw('');
    setEditSrc(getInitialEditSrc(item.parameters));
  }, [item]);

  const url = location.state['url'] + '/' + root + '/wxapi/' + controller + '/' + item.name;

  const run = useCallback(async () => {
    try {
      const ret = await buildRequest(
        location.state,
        {
          baseURL: '',
          url,
          method: item.type,
          data: useRaw ? raw : editSrc,
        },
        true,
        false,
        root,
      );
      setResponse(ret.data);
    } catch (error) {
      const data = error.response?.data || error;
      setResponse({ code: data.code, error: data.error });
    }
  }, [editSrc]);
  return (
    <Box flex={1} style={{ width: '100%' }}>
      <Grid container alignItems="center">
        <Grid container item xs direction="column">
          <Box mt={2}>
            <Typography variant="h4" color="textPrimary">
              {item.public && <Chip label="Public" color="secondary" />}{' '}
              <Chip label={item.type} color="primary" /> {url}
            </Typography>
            <Box mt={1}>
              <Typography variant="body2" color="textSecondary">
                {item.documentation}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box p={1} display="flex" justifyContent="flex-end">
            <Button onClick={run} color="primary" variant="contained">
              Run
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box mt={2}>
        <TableContainer component={Paper}>
          <Table style={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell width={150}>参数</TableCell>
                <TableCell width={100}>必需</TableCell>
                <TableCell>类型</TableCell>
                <TableCell>说明</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item?.parameters?.map(parameter => (
                <TableRow key={parameter.name}>
                  <TableCell>{parameter.name.replace('?', '')}</TableCell>
                  <TableCell>{parameter.name.includes('?') ? '否' : '是'}</TableCell>
                  <TableCell>
                    {typeof parameter.type === 'object'
                      ? JSON.stringify(parameter.type)
                      : parameter.type}
                  </TableCell>
                  <TableCell>{parameter.documentation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box mt={2}>
        <Grid container direction="row">
          <Grid item xs={12} md>
            <Box display="flex">
              <Box flex={1} display="flex" alignItems="center">
                <Typography color="textPrimary" variant="h4">
                  Request
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={useRaw}
                    onChange={(e, value) => setUseRaw(value)}
                  />
                }
                label="raw"
              />
            </Box>
            <Box my={2} mr={2}>
              <Paper variant={theme['name'] === THEME.LIGHT ? 'elevation' : 'outlined'}>
                {useRaw ? (
                  <TextField
                    rows={4}
                    variant="outlined"
                    label="Raw"
                    fullWidth
                    multiline
                    placeholder="request body"
                    value={raw}
                    onChange={({ target: { value } }) => setRaw(value)}
                  />
                ) : (
                  <ReactJson
                    style={{ padding: 16, borderRadius: 4 }}
                    theme={theme['name'] === THEME.LIGHT ? 'rjv-default' : 'google'}
                    src={editSrc}
                    onAdd={({ updated_src }) => setEditSrc(updated_src)}
                    onDelete={({ updated_src }) => setEditSrc(updated_src)}
                    onEdit={({ updated_src }) => setEditSrc(updated_src)}
                  />
                )}
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={12} md>
            <Box my="12px">
              <Typography color="textPrimary" variant="h4">
                Response
              </Typography>
            </Box>
            <Box my={2} mr={2}>
              <Paper variant={theme['name'] === THEME.LIGHT ? 'elevation' : 'outlined'}>
                <ReactJson
                  style={{ padding: 16, borderRadius: 4 }}
                  collapsed={2}
                  theme={theme['name'] === THEME.LIGHT ? 'rjv-default' : 'google'}
                  src={response || {}}
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
