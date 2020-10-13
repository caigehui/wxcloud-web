import WxPage from '@/components/WxPage';
import WxSearchField from '@/components/WxSearchField';
import WxSnackBar from '@/components/WxSnackBar';
import WxTableWithApi from '@/components/WxTableWithApi';
import { Chip } from '@material-ui/core';
import {
  AddCircleOutlineOutlined,
  Description,
  PlayArrow,
  Replay,
  Stop,
  Update,
} from '@material-ui/icons';
import { REGULAR_PERMISSIONS } from '@wxsoft/wxboot/constants/permissions';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { useLocation, useModel } from 'umi';
import ContainerLog from './components/ContainerLog';
import MicroEdit from './components/MicroEdit';
import { buildRequest } from './utils';

const readonlyServices = ['konga', 'kong', 'mqtt', 'mongodb', 'postgres'];

export default ({ menu }) => {
  const tableRef = useRef(null);
  const [name, setName] = useState('');
  const [current, setCurrent] = useState(null);
  const [containerLog, setContainerLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { getPermission } = useModel('useAuthModel');

  const { data: networkOptions } = useRequest(
    () => buildRequest(location.state, { url: '/WxMicro/networks' }),
    { formatResult: data => data.data, initialData: [] },
  );

  const { data: localImages } = useRequest(
    () => buildRequest(location.state, { url: '/WxImage/list' }),
    { formatResult: data => data.data?.list?.map(i => i.RepoTags[0]) || [], initialData: [] },
  );
  const refresh = () => {
    tableRef.current?.refresh();
  };
  const pmCreate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'microservices');
  const pmUpdate = getPermission([REGULAR_PERMISSIONS.CREATE[0]], 'microservices');
  const pmDelete = getPermission([REGULAR_PERMISSIONS.DELETE[0]], 'microservices');

  return (
    <WxPage
      menu={menu}
      buttonIcon={<AddCircleOutlineOutlined />}
      buttonTitle="新增容器"
      buttonDiabled={!pmCreate}
      onButtonClick={() => {
        setCurrent({ isNew: true });
      }}
    >
      <WxTableWithApi
        ref={tableRef}
        onWxApi={() => () =>
          buildRequest(
            location.state,
            {
              url: '/WxMicro/list',
              params: {
                name,
              },
            },
            true,
          )}
        options={{ sorting: false, search: false }}
        additionalFilter={
          <>
            <WxSearchField
              style={{ marginLeft: 0 }}
              label="容器名"
              value={name}
              onChange={setName}
            />
          </>
        }
        columns={[
          { title: '容器名', render: rowData => rowData.Name },
          { title: '镜像名', render: rowData => rowData.Image },
          { title: 'ID', field: 'Id', render: rowData => rowData.Id.substr(0, 12) },
          {
            title: '网络',
            render: rowData => Object.keys(rowData.NetworkSettings.Networks).join(', '),
          },
          {
            title: '端口号',
            render: rowData =>
              rowData.Ports.filter(i => i.PublicPort)
                .map(i => i.PrivatePort + ':' + i.PublicPort + '/' + i.Type)
                .join(', '),
          },
          {
            title: '状态',
            render: rowData => (
              <Chip
                label={rowData.State}
                color={rowData.State === 'running' ? 'primary' : 'secondary'}
              />
            ),
          },
          {
            title: '创建时间',
            render: rowData => {
              return dayjs(rowData.Created * 1000).format('YYYY/MM/DD HH:mm:ss');
            },
          },
        ]}
        actions={[
          () => ({
            icon: () => <Description color="primary" />,
            tooltip: '查看日志',
            onClick: async (event, rowData) => {
              setContainerLog(rowData);
            },
          }),
          rowData => ({
            disabled: !pmUpdate || readonlyServices.some(i => i === rowData.Name),
            icon: () => (
              <Update
                color={
                  !pmUpdate || readonlyServices.some(i => i === rowData.Name)
                    ? 'disabled'
                    : 'primary'
                }
              />
            ),
            tooltip: '更新',
            onClick: async (event, rowData) => {
              setCurrent(rowData);
            },
          }),
          rowData => ({
            disabled: !pmUpdate || readonlyServices.some(i => i === rowData.Name),
            icon: () => (
              <Replay
                color={
                  !pmUpdate || readonlyServices.some(i => i === rowData.Name)
                    ? 'disabled'
                    : 'primary'
                }
              />
            ),
            tooltip: '重启',
            onClick: async (event, rowData) => {
              if (loading) return;
              setLoading(true);
              const { code } = await buildRequest(location.state, {
                url: '/WxMicro/restart',
                method: 'POST',
                data: {
                  id: rowData.Id,
                },
              });
              code === 0 && WxSnackBar.success(`重启${rowData.Name}成功`);
              setLoading(false);
              refresh();
            },
          }),
          rowData => ({
            disabled: !pmUpdate || readonlyServices.some(i => i === rowData.Name),
            icon: () =>
              rowData.State === 'running' ? (
                <Stop
                  color={
                    !pmUpdate || readonlyServices.some(i => i === rowData.Name)
                      ? 'disabled'
                      : 'primary'
                  }
                />
              ) : (
                <PlayArrow
                  color={
                    !pmUpdate || readonlyServices.some(i => i === rowData.Name)
                      ? 'disabled'
                      : 'primary'
                  }
                />
              ),
            tooltip: rowData.State === 'running' ? '停止' : '启动',
            onClick: async (event, rowData) => {
              if (loading) return;
              setLoading(true);
              const { code } = await buildRequest(location.state, {
                url: rowData.State === 'running' ? '/WxMicro/stop' : '/WxMicro/start',
                method: 'POST',
                data: {
                  id: rowData.Id,
                },
              });
              code === 0 &&
                WxSnackBar.success(
                  (rowData.State === 'running' ? '停止' : '启动') + `${rowData.Name}成功`,
                );
              setLoading(false);
              refresh();
            },
          }),
        ]}
        deletable={rowData => ({
          disabled: !pmDelete || readonlyServices.some(i => i === rowData.Name),
          confirmOptions: {
            title: `删除${rowData.Name}`,
            message: `确定要删除${rowData.Name}吗？`,
            onConfirm: async () => {
              await buildRequest(location.state, {
                url: '/WxMicro/delete',
                method: 'POST',
                data: {
                  id: rowData.Id,
                },
              });
              refresh();
              return true;
            },
          },
        })}
      />
      <MicroEdit
        current={current}
        refresh={refresh}
        onClose={() => setCurrent(null)}
        networkOptions={networkOptions}
        localImages={localImages}
      />
      <ContainerLog containerLog={containerLog} onClose={() => setContainerLog(null)} />
    </WxPage>
  );
};
