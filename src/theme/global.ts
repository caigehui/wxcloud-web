import { makeStyles } from '@material-ui/core';
import { THEME } from '../constants';

const LIGHT_BAR_COLOR = '#91d5ff';

const useGlobalStyles = makeStyles(theme => ({
  '@global': {
    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        height: 3,
        borderRadius: 1.5,
        background: theme['name'] === THEME.LIGHT ? LIGHT_BAR_COLOR : theme.palette.primary.main,
      },
      '& .spinner-icon': {
        borderTopColor:
          theme['name'] === THEME.LIGHT
            ? theme.palette.background.default
            : theme.palette.primary.main,
        borderLeftColor:
          theme['name'] === THEME.LIGHT
            ? theme.palette.background.default
            : theme.palette.primary.main,
      },
      '& .peg': {
        boxShadow: `0 0 10px ${
          theme['name'] === THEME.LIGHT ? LIGHT_BAR_COLOR : theme.palette.primary.main
        }, 0 0 5px ${theme['name'] === THEME.LIGHT ? LIGHT_BAR_COLOR : theme.palette.primary.main}`,
      },
    },
    '*::-webkit-scrollbar': {
      width: 6,
      height: 6,
      border: 'none',
    },
    '*::-webkit-scrollbar-track': {
      background: 'transparent',
      border: 'none',
    },
    '*::-webkit-scrollbar-thumb': {
      background:
        theme['name'] === THEME.LIGHT
          ? 'rgb(220, 220, 220)!important'
          : 'rgb(120, 120, 120)!important',
      borderRadius: 3,
      border: 'none!important',
    },
    '*::-webkit-scrollbar-corner': {
      background: 'transparent',
    },
  },
}));

export default useGlobalStyles;
