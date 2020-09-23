// import React from 'react';
// import { Tabs, Tab, Box, Typography, useTheme } from '@material-ui/core';
// import { useLocation, useHistory, useModel, useAliveController } from 'umi';
// import { X } from 'react-feather';
// import { getMenuItemNameByKey, getMenuPathByKey } from '@/utils';
// import uniqBy from 'lodash/uniqBy';
// import last from 'lodash/last';
// import { THEME } from '@wxsoft/wxcomponents/lib/constants';

// function MyTab({ node, menu, value }: any) {
//   const history = useHistory();
//   const location = useLocation();
//   const { getCachingNodes, dropScope } = useAliveController();
//   const cachingNodes = uniqBy(getCachingNodes(), 'name');
//   const closable = cachingNodes.length > 1;
//   const activated = last(location.pathname.split('/')) === node.name;

//   function dropTab(e) {
//     e.stopPropagation();
//     const currentName = node.name;

//     // 如果关闭激活中的 KeepAlive Tab，需要先离开当前路由
//     // 触发 KeepAlive unactivated 后再进行 drop
//     if (activated) {
//       const unlisten = history.listen(() => {
//         unlisten();
//         setTimeout(() => {
//           dropScope(currentName);
//         }, 60);
//       });

//       // 前往排除当前 node 后的最后一个 tab
//       history.push(cachingNodes.filter(node => node.name !== currentName).pop().name);
//     } else {
//       dropScope(currentName);
//     }
//   }

//   return (
//     <Tab
//       style={{ padding: 0 }}
//       onClick={() => {
//         if (activated) return;
//         history.replace(getMenuPathByKey(node.name, menu));
//       }}
//       label={
//         <Box
//           width="100%"
//           color="textPrimary"
//           display="flex"
//           flexDirection="row"
//           alignItems="center"
//         >
//           <Box flex={1} color={activated ? 'white' : '#e6e6e6'}>
//             <Typography
//               style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
//               color="inherit"
//               variant="body2"
//             >
//               {getMenuItemNameByKey(node.name, menu)}
//             </Typography>
//           </Box>
//           {closable && <X onClick={dropTab} size={20} />}
//         </Box>
//       }
//       value={value}
//     />
//   );
// }

// function KeepAliveTabs() {
//   const { menu } = useModel('useAuthModel');
//   const location = useLocation();
//   const { getCachingNodes } = useAliveController();
//   const cachingNodes = getCachingNodes();
//   const uniqueNodes = uniqBy(cachingNodes, 'name');
//   const value = uniqueNodes.findIndex(node => last(location.pathname.split('/')) === node.name);
//   const theme = useTheme();

//   return (
//     <Tabs
//       style={{ maxWidth: 1000 }}
//       variant="scrollable"
//       scrollButtons="auto"
//       TabIndicatorProps={{
//         style: {
//           backgroundColor:
//             theme['name'] === THEME.LIGHT
//               ? theme.palette.background['dark']
//               : theme.palette.primary.main,
//           height: 3,
//           borderRadius: '3px 3px 0 0',
//         },
//       }}
//       value={value === -1 ? false : value}
//     >
//       {uniqueNodes.map((node, idx) => (
//         <MyTab value={idx} key={idx} node={node} menu={menu} />
//       ))}
//     </Tabs>
//   );
// }

// export default KeepAliveTabs;
