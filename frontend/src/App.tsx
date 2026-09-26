import {
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';

import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom';

import YarnsPage from './pages/YarnsPage';
import ProjectsPage from './pages/ProjectsPage';

const theme = createTheme({
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

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Название сайта
          </Typography>

          <Stack
            component="nav"
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ mb: 4 }}
          >
            <Button
              component={NavLink}
              to="/yarns"
              sx={{
                '&.active': {
                  backgroundColor: '#DCDCDC',
                },
              }}
            >
              Пряжа
            </Button>

            <Button
              component={NavLink}
              to="/projects"
              sx={{
                '&.active': {
                  backgroundColor: '#DCDCDC',
                },
              }}
            >
              Проекты
            </Button>
          </Stack>

          <Box component="main">
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/yarns" replace />}
              />

              <Route path="/yarns" element={<YarnsPage />} />

              <Route path="/projects" element={<ProjectsPage />} />

              <Route
                path="*"
                element={
                  <Typography component="h1" variant="h4">
                    Страница не найдена
                  </Typography>
                }
              />
            </Routes>
          </Box>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}