import { createTheme } from '@mui/material/styles';

// Color palette (priority = dominance)
// #81A6C6 - Steel Blue       (primary - buttons, links, dominant UI)
// #AACDDC - Sky Blue         (secondary - hover, subtle highlights)
// #F3E3D0 - Linen            (background - pages, cards)
// #D2C4B4 - Warm Taupe       (accent - borders, muted text, dividers)

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#81A6C6',
      light: '#AACDDC',
      dark: '#5f87a8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#AACDDC',
      light: '#c6dfe8',
      dark: '#81A6C6',
      contrastText: '#2d4a5e',
    },
    background: {
      default: '#F3E3D0',
      paper: '#FAF0E8',
    },
    text: {
      primary: '#2d3a45',
      secondary: '#5a6b7a',
      disabled: '#D2C4B4',
    },
    divider: '#D2C4B4',
    action: {
      hover: 'rgba(170, 205, 220, 0.15)',
      selected: 'rgba(129, 166, 198, 0.2)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 700, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F3E3D0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '9px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(129,166,198,0.35)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #81A6C6 0%, #6f96b8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6f96b8 0%, #5f87a8 100%)',
          },
        },
        outlinedPrimary: {
          borderColor: '#81A6C6',
          color: '#81A6C6',
          '&:hover': {
            borderColor: '#5f87a8',
            backgroundColor: 'rgba(129,166,198,0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #D2C4B4',
          backgroundColor: '#FAF0E8',
          boxShadow: '0 2px 8px rgba(129,116,100,0.08)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#fff',
            '& fieldset': { borderColor: '#D2C4B4' },
            '&:hover fieldset': { borderColor: '#AACDDC' },
            '&.Mui-focused fieldset': { borderColor: '#81A6C6' },
          },
          '& label.Mui-focused': { color: '#81A6C6' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FAF0E8',
          borderBottom: '1px solid #D2C4B4',
          boxShadow: '0 1px 4px rgba(129,116,100,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        colorDefault: {
          backgroundColor: 'rgba(170, 205, 220, 0.25)',
          color: '#2d4a5e',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#D2C4B4',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
