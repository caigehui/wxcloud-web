import { createMuiTheme, responsiveFontSizes, ThemeOptions } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';
import typography from './typography';
import { softShadows, strongShadows } from './shadows';
import { PRIMARY_COLOR, SECONDARY_COLOR, THEME } from '../constants';


const baseConfig = {
  direction: 'ltr',
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: 'hidden',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: 'rgba(0,0,0,0.075)',
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
    MuiAccordionDetails: {
      root: {
        paddingTop: 0,
      },
    },
  },
};

const themeConfigs = [
  {
    name: THEME.LIGHT,
    overrides: {
      MuiInputBase: {
        input: {
          '&::placeholder': {
            opacity: 1,
            color: colors.blueGrey[500],
          },
        },
      },
      MuiTypography: {
        root: {
          textTransform: 'none',
          color: colors.blueGrey[900],
        },
      },
      ...baseConfig.overrides,
    },
    palette: {
      action: {
        active: colors.blueGrey[500],
      },
      background: {
        default: '#ffffff',
        dark: '#f4f6f8',
        paper: '#ffffff',
        bar: 'rgb(200, 200, 200)!important',
      },
      primary: {
        main: PRIMARY_COLOR,
      },
      secondary: {
        main: SECONDARY_COLOR,
      },
      text: {
        primary: colors.blueGrey[900],
        secondary: colors.blueGrey[500],
      },
    },
    shadows: softShadows,
  },
  {
    name: THEME.ONE_DARK,
    overrides: {
      MuiTypography: {
        root: {
          textTransform: 'none',
          color: '#e6e5e8',
        },
      },
      ...baseConfig.overrides,
    },
    palette: {
      type: 'dark',
      action: {
        active: 'rgba(255, 255, 255, 0.54)',
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        focus: 'rgba(255, 255, 255, 0.12)',
      },
      background: {
        default: '#282C34',
        dark: '#20232A',
        paper: '#282C34',
        bar: 'rgb(120, 120, 120)!important',
      },
      primary: {
        main: PRIMARY_COLOR,
      },
      secondary: {
        main: SECONDARY_COLOR,
      },
      text: {
        primary: '#e6e5e8',
        secondary: '#adb0bb',
      },
      error: {
        main: '#e06c75',
        dark: '#be5046',
      },
    },
    shadows: strongShadows,
  }
];

export function createTheme(name: string) {
  let themeConfig = themeConfigs.find(theme => theme.name === name);

  if (!themeConfig) {
    console.warn(new Error(`The theme ${name} is not valid`));
    [themeConfig] = themeConfigs;
  }

  // @ts-ignore
  const options: ThemeOptions = {
    ...baseConfig,
    ...themeConfig,
    typography,
  };
  let theme = createMuiTheme(options);
  theme = responsiveFontSizes(theme);

  return theme;
}

/**
 * 
" +---------------------------------------------+
" |  Color Name  |         RGB        |   Hex   |
" |--------------+--------------------+---------|
" | Black        | rgb(40, 44, 52)    | #282c34 |
" |--------------+--------------------+---------|
" | White        | rgb(171, 178, 191) | #abb2bf |
" |--------------+--------------------+---------|
" | Light Red    | rgb(224, 108, 117) | #e06c75 |
" |--------------+--------------------+---------|
" | Dark Red     | rgb(190, 80, 70)   | #be5046 |
" |--------------+--------------------+---------|
" | Green        | rgb(152, 195, 121) | #98c379 |
" |--------------+--------------------+---------|
" | Light Yellow | rgb(229, 192, 123) | #e5c07b |
" |--------------+--------------------+---------|
" | Dark Yellow  | rgb(209, 154, 102) | #d19a66 |
" |--------------+--------------------+---------|
" | Blue         | rgb(97, 175, 239)  | #61afef |
" |--------------+--------------------+---------|
" | Magenta      | rgb(198, 120, 221) | #c678dd |
" |--------------+--------------------+---------|
" | Cyan         | rgb(86, 182, 194)  | #56b6c2 |
" |--------------+--------------------+---------|
" | Gutter Grey  | rgb(76, 82, 99)    | #4b5263 |
" |--------------+--------------------+---------|
" | Comment Grey | rgb(92, 99, 112)   | #5c6370 |
" +---------------------------------------------+
 */
