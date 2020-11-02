import WxPage from '@/components/WxPage';
import { List, ListItem, ListItemText, Box, useTheme, Paper } from '@material-ui/core';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import React from 'react';
import { useRequest, useSessionStorageState } from 'ahooks';
import requestWxApi from '@/utils/requestWxApi';
import WxEmpty from '@/components/WxEmpty';
import ReleaseItem from './component/ReleaseItem';

export default ({ menu }) => {
  const theme = useTheme();
  const [currentProject, setCurrentProject] = useSessionStorageState('currentProject', null);

  const { data: projects } = useRequest(() => requestWxApi({ url: '/WxReleases/getProjects' }), {
    initialData: [],
    onSuccess: prjs => !currentProject && setCurrentProject(prjs[0]),
  });

  const { data: releases } = useRequest(
    () =>
      requestWxApi({
        url: '/WxReleases/list',
        params: {
          page: 1,
          pageSize: 999,
          conditions: JSON.stringify([['project', 'equalTo', currentProject]]),
        },
      }),
    {
      initialData: [],
      formatResult: data => data.list,
      refreshDeps: [currentProject],
      ready: !!currentProject,
    },
  );

  return (
    <WxPage menu={menu} title="版本发行">
      <Paper>
        <Box p={2} mb={2} height="100%" overflow="auto">
          <Box display="flex">
            <Box width={200}>
              <List component="nav">
                {projects.map(i => (
                  <Box
                    key={i}
                    onClick={() => {
                      setCurrentProject(i);
                    }}
                  >
                    <ListItem button selected={i === currentProject}>
                      <ListItemText primary={i} />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Box>

            {releases.length > 0 ? (
              <Box width={200} color={theme.palette.text.primary}>
                <Timeline>
                  {releases.map(i => (
                    <TimelineItem key={i.objectId}>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <ReleaseItem item={i} />
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Box>
            ) : (
              <Box width={500}>
                <WxEmpty title="暂无版本发行" />
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </WxPage>
  );
};
