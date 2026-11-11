import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#56d281',
      dark: '#2cb564',
      light: '#7abd8d',
      contrastText: '#10251A',
    },
   secondary: {
      main: '#0077B6',
      dark: '#005F8F',
      light: '#8FD8F5',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F7F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#17251D',
      secondary: '#64746A',
    },
    success: {
      main: '#16A36A',
    },
    warning: {
      main: '#D99A32',
    },
    error: {
      main: '#DC5252',
    },
    divider: '#E7EDE9',
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 750 },
    h4: { fontWeight: 750 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: 'none',
      fontWeight: 650,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F4F7F5',
          scrollbarColor: '#C5D2C9 transparent',
          '& ::selection': {
            backgroundColor: '#8FD8F5',
            color: '#10251A',
          },
        },
      },
    },

    MuiButton: {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: {
      borderRadius: 10,
      padding: '9px 18px',
      transition: 'all 180ms ease',
      variants: [
        {
          props: { variant: 'text', color: 'primary' },
          style: {
            color: '#0077B6',
            '&:hover': { backgroundColor: 'rgba(0, 119, 182, 0.08)' },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            color: '#0077B6',
            borderColor: '#0077B6',
            '&:hover': {
              borderColor: '#005F8F',
              backgroundColor: 'rgba(0, 119, 182, 0.08)',
            },
          },
        },
      ],
    },
    contained: {
      '&:hover': {
        transform: 'translateY(-1px)',
      },
    },
  },
},

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #E7EDE9',
          borderRadius: 14,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 18px rgba(20, 45, 30, 0.04)',
          transition: 'box-shadow 180ms ease, transform 180ms ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(20, 45, 30, 0.08)',
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#8FD8F5',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0077B6',
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: '#DCE5DF',
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': { color: '#0077B6' },
        },
      },
    },

    MuiCircularProgress: {
      defaultProps: {
        color: 'secondary',
      },
    },

    MuiLink: {
      defaultProps: {
        color: 'secondary',
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 650,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#F5F8F6',
          color: '#64746A',
          fontWeight: 700,
        },
        root: {
          borderColor: '#E7EDE9',
        },
      },
    },
  },
})
