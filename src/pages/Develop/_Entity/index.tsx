// import React, { useMemo, useState } from 'react';
// import { AddCircleOutlineOutlined, Edit } from '@material-ui/icons';
// import Create from './components/Create';
// import { READONLY_ENTITIES } from '@/constants';
// import { flatChildren } from '@/utils';
// import { WxDevelopApi } from '@wxapi/wxeap-admin';
// import useRestarting from '@/hooks/useRestarting';
// import { requestWxApi } from '@wxsoft/wxcomponents';
// import { WxLoading, WxPage, WxTable, useWxApi } from '@wxsoft/wxcomponents';

// function Entity({ menu }: any) {
//   const [current, setCurrent] = useState(null);
//   const { data, refresh } = useWxApi(WxDevelopApi.getEntities, { initialData: [] });
//   const { data: isDocker } = useWxApi(WxDevelopApi.isDocker, { initialData: false });
//   const { restarting } = useRestarting(refresh);

//   const entities: any[] = useMemo(() => {
//     return flatChildren(data).map((i: any) => {
//       const doc = i.documentation.trim().split('\n');
//       const getField = index => doc?.[index]?.substr(doc?.[index].indexOf(' ')).trim() || '';
//       return {
//         name: i.name,
//         dir: i.parent,
//         cname: getField(0),
//         note: getField(1),
//         updatedAt: getField(2),
//         updatedBy: getField(3),
//         propertiesStr: i.properties?.map(j => j.name).join(', '),
//         properties: i.properties,
//       };
//     });
//   }, [data]);

//   return (
//     <WxPage
//       menu={menu}
//       buttonIcon={<AddCircleOutlineOutlined />}
//       onButtonClick={() => setCurrent({ isNew: true })}
//       buttonTitle="新增Entity"
//       buttonDiabled={isDocker}
//     >
//       <WxTable
//         readonly={isDocker}
//         title="Entity列表"
//         deletable={rowData => ({
//           disabled: READONLY_ENTITIES.some(i => i === rowData.name),
//           confirmOptions: {
//             title: `删除${rowData.name}`,
//             message: `确定要删除${rowData.name}吗？删除后不会移除数据库对应的表，如果需要请手动去数据库删除该表。`,
//             onConfirm: async () => {
//               await requestWxApi(
//                 WxDevelopApi.deleteEntity({ name: rowData.name, dir: rowData.dir }),
//               );
//               return true;
//             },
//           },
//         })}
//         actions={[
//           {
//             icon: () => <Edit color="primary" />,
//             tooltip: '编辑',
//             onClick: (event, rowData) => {
//               setCurrent(rowData);
//             },
//           },
//         ]}
//         columns={[
//           { title: 'Entity name', field: 'name' },
//           { title: '目录', field: 'dir' },
//           { title: '中文名', field: 'cname' },
//           { title: '说明和备注', field: 'note' },
//           { title: '字段', field: 'propertiesStr' },
//           { title: '更新时间', field: 'updatedAt', type: 'datetime' },
//           { title: '更新者', field: 'updatedBy' },
//         ]}
//         data={entities}
//       />
//       <Create
//         current={current}
//         onClose={() => setCurrent(null)}
//         entityNames={entities.map(i => i.name)}
//       />
//       <WxLoading loading={restarting} message="后台服务启动中..." />
//     </WxPage>
//   );
// }

// export default Entity;
