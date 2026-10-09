import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#636363',
    },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
});