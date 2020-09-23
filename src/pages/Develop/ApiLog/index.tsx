import React, { useMemo } from 'react';
import { Container, Section, Bar } from 'react-simple-resizer';
import { makeStyles, Hidden, useTheme } from '@material-ui/core';
import { WxPage, WxEmpty, WxTable, useWxApi, flatChildren } from '@wxsoft/wxcomponents';
import { DesktopWindows } from '@material-ui/icons';
import { WxDevelopApi } from '@wxapi/wxeap-admin';
import { useSessionStorageState } from 'ahooks';
import Detail from './components/Detail';

function Controller({ menu }: any) {
  const theme = useTheme();
  const styles = useStyles();
  const [current, setCurrent] = useSessionStorageState<undefined | Object>('controller_key', null);
  const { data } = useWxApi(WxDevelopApi.getApiControllers);

  const controllers: any[] = useMemo(() => {
    return flatChildren(data);
  }, [data]);

  return (
    <>
      <Hidden mdDown>
        <Container className={styles.container}>
          <Section minSize={400} style={{ flex: 0.7 }}>
            <WxPage menu={menu}>
              <WxTable
                title="Controllers"
                data={controllers}
                columns={[
                  { title: '类名', field: 'name' },
                  { title: '目录', field: 'parent' },
                  {
                    title: '成员接口',
                    render: rowData => rowData.properties?.map(j => j.name).join(', '),
                  },
                  {
                    title: '说明和备注',
                    field: 'documentation',
                    headerStyle: { minWidth: 200 },
                    cellStyle: { minWidth: 200 },
                  },
                ]}
                options={{
                  rowStyle: rowData => {
                    if (rowData.name === current?.['name'])
                      return { backgroundColor: theme.palette.action.hover };
                    else {
                      return {};
                    }
                  },
                }}
                onRowClick={(e, rowData) => setCurrent(rowData)}
              />
            </WxPage>
          </Section>
          <Bar size={6} className={styles.bar} />
          <Section minSize={400}>
            <Detail current={current} />
          </Section>
        </Container>
      </Hidden>
      <Hidden lgUp>
        <WxEmpty
          title="请在宽屏下访问"
          icon={<DesktopWindows color="primary" fontSize="inherit" />}
        />
      </Hidden>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  bar: {
    backgroundColor: theme.palette.background['bar'],
    cursor: 'col-resize',
  },
}));

export default Controller;
