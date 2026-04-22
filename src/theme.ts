import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#364F6B', // Navy
      light: '#5B7694',
      dark: '#1B2E45',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3FC1C9', // Teal
      light: '#72D6DB',
      dark: '#24868C',
      contrastText: '#ffffff',
    },
    error: {
      main: '#FC5185', // Accent Pink for errors/actions
    },
    background: {
      default: '#F5F5F5', // Surface Light Gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      disabled: '#A0A0A0',
    },
    divider: 'rgba(54, 79, 107, 0.1)',
    action: {
      hover: 'rgba(63, 193, 201, 0.08)',
      selected: 'rgba(63, 193, 201, 0.16)',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 800, fontSize: '3rem', letterSpacing: '-0.02em', color: '#364F6B' },
    h2: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.01em', color: '#364F6B' },
    h3: { fontWeight: 700, fontSize: '2rem', color: '#364F6B' },
    h4: { fontWeight: 600, fontSize: '1.5rem', color: '#364F6B' },
    h5: { fontWeight: 600, fontSize: '1.25rem', color: '#364F6B' },
    h6: { fontWeight: 600, fontSize: '1rem', color: '#364F6B' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.03em' },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F5F5',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(54, 79, 107, 0.2)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          backgroundColor: '#364F6B',
          '&:hover': {
            backgroundColor: '#1B2E45',
          },
        },
        containedSecondary: {
          backgroundColor: '#FC5185', // Accent Pink for primary calls to action
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#D13B67',
          },
        },
        outlinedPrimary: {
          borderColor: '#364F6B',
          color: '#364F6B',
          '&:hover': {
            borderColor: '#1B2E45',
            backgroundColor: 'rgba(54, 79, 107, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(54, 79, 107, 0.08)',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FAFAFA',
            transition: 'all 0.2s ease',
            '& fieldset': { borderColor: 'rgba(54, 79, 107, 0.15)' },
            '&:hover fieldset': { borderColor: '#3FC1C9' },
            '&.Mui-focused fieldset': { borderColor: '#364F6B', borderWidth: '2px' },
            '&.Mui-focused': { backgroundColor: '#FFFFFF' },
          },
          '& label.Mui-focused': { color: '#364F6B' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(54, 79, 107, 0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
        colorDefault: {
          backgroundColor: 'rgba(54, 79, 107, 0.06)',
          color: '#364F6B',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(54, 79, 107, 0.08)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#3FC1C9',
          height: '3px',
          borderTopLeftRadius: '3px',
          borderTopRightRadius: '3px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          color: '#666666',
          '&.Mui-selected': {
            color: '#364F6B',
          },
        },
      },
    },
  },
});

export default theme;
