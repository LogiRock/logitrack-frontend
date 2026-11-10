import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#68FD9D',
      dark: '#35D979',
      light: '#A4FFBF',
      contrastText: '#10251A',
    },
    secondary: {
      main: '#F1C980',
      dark: '#D9AD5C',
      light: '#F8DFAF',
      contrastText: '#30230D',
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
            backgroundColor: '#A4FFBF',
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
            borderColor: '#68FD9D',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#35D979',
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: '#DCE5DF',
        },
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
