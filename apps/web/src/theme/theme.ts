import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
    ].join(','),
  },

  shape: {
    borderRadius: 12,
  },

  spacing: 8,

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
});