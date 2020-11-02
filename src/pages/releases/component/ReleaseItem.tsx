import { GITLAB_URL } from '@/constants';
import { Avatar, Box, Link, Typography, useTheme } from '@material-ui/core';
import { LocalOffer } from '@material-ui/icons';
import dayjs from 'dayjs';
import React from 'react';

export default ({ item }) => {
  const theme = useTheme();
  return (
    <Box width={600} px={2} mb={4}>
      <Box display="flex" alignItems="center" color={theme.palette.text.primary}>
        <LocalOffer color="inherit" style={{ marginRight: theme.spacing(1) }} />
        <Link href={GITLAB_URL + `/wxsoft/${item.project}/tags/${item.tag}`} target="_blank">
          <Typography variant="h2" color="inherit">
            v{item.tag}
          </Typography>
        </Link>
      </Box>
      <Box mt={2} display="flex" alignItems="center">
        <Avatar
          style={{
            padding: 2,
            width: 24,
            height: 24,
            marginRight: theme.spacing(1),
            background: theme.palette.secondary.main,
          }}
          src={item?.user?.['avatar']?.url}
        />
        <Typography color="textSecondary" variant="body2">
          {item.user.nickname} 在 {dayjs(item.createdAt).format('YYYY/MM/DD HH:mm')} 时发布了该版本
          · 与上个版本之间有{' '}
          <Link
            href={GITLAB_URL + `/wxsoft/${item.project}/compare/${item.lastTag}...${item.tag}`}
            target="_blank"
          >
            {item.commitNum} commits
          </Link>
        </Typography>
      </Box>
      {item.feat?.length > 0 && (
        <Box mt={2}>
          <Typography variant="h4" gutterBottom>
            新特性：
          </Typography>
          {item.feat.map(i => (
            <Box ml={2} key={i.commit}>
              <Typography gutterBottom>
                • {i.message} (
                <Link
                  href={GITLAB_URL + `/wxsoft/${item.project}/commit/${i.commit}`}
                  target="_blank"
                >
                  {i.commit.substr(0, 7)}
                </Link>
                )
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {item.perf?.length > 0 && (
        <Box mt={2}>
          <Typography variant="h4" gutterBottom>
            优化：
          </Typography>
          {item.perf.map(i => (
            <Box ml={2} key={i.commit}>
              <Typography gutterBottom>
                • {i.message} (
                <Link
                  href={GITLAB_URL + `/wxsoft/${item.project}/commit/${i.commit}`}
                  target="_blank"
                >
                  {i.commit.substr(0, 7)}
                </Link>
                )
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {item.fix?.length > 0 && (
        <Box mt={2}>
          <Typography variant="h4" gutterBottom>
            修复：
          </Typography>
          {item.fix.map(i => (
            <Box ml={2} key={i.commit}>
              <Typography gutterBottom>
                • {i.message} (
                <Link
                  href={GITLAB_URL + `/wxsoft/${item.project}/commit/${i.commit}`}
                  target="_blank"
                >
                  {i.commit.substr(0, 7)}
                </Link>
                )
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {item.chore?.length > 0 && (
        <Box mt={2}>
          <Typography variant="h4" gutterBottom>
            其他更改：
          </Typography>
          {item.chore.map(i => (
            <Box ml={2} key={i.commit}>
              <Typography gutterBottom>
                • {i.message} (
                <Link
                  href={GITLAB_URL + `/wxsoft/${item.project}/commit/${i.commit}`}
                  target="_blank"
                >
                  {i.commit.substr(0, 7)}
                </Link>
                )
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
