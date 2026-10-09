import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Stack,
  ThemeProvider,
  Typography,
} from '@mui/material';

import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from 'react-router-dom';

import { theme } from './theme';

import YarnsPage from '../pages/YarnsPage';
import ProjectsPage from '../pages/ProjectsPage';
import YarnDetailsPage from '../pages/YarnDetailsPage';
import YarnFormPage from '../pages/YarnFormPage';
import ProjectDetailsPage from '../pages/ProjectDetailsPage';
import ProjectFormPage from '../pages/ProjectFormPage';

import { useKnittingData } from './useKnittingData';


export default function App() {
  const {
    yarns,
    projects,
    status,
    error,
    retry,
    saveYarn,
    saveProject,
    deleteYarn,
    deleteProject,
  } = useKnittingData();

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
              {status === 'loading' && (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  role="status"
                >
                  <CircularProgress size={24} aria-hidden="true" />
                  <Typography>Загрузка данных…</Typography>
                </Stack>
              )}

              {status === 'error' && (
                <Stack spacing={2} alignItems="flex-start">
                  <Alert severity="error">{error}</Alert>
                  <Button variant="outlined" onClick={retry}>
                    Повторить
                  </Button>
                </Stack>
              )}

            {status === 'success' && (

              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/yarns" replace />}
                />

                <Route
                  path="/yarns"
                  element={<YarnsPage yarns={yarns} />}
                />

                <Route
                  path="/yarns/new"
                  element={<YarnFormPage yarns={yarns} onSave={saveYarn} />}
                />

                <Route
                  path="/yarns/:id"
                  element={
                    <YarnDetailsPage
                      yarns={yarns}
                      projects={projects}
                      onDelete={deleteYarn}
                    />
                  }
                />

                <Route
                  path="/yarns/:id/edit"
                  element={<YarnFormPage yarns={yarns} onSave={saveYarn} />}
                />

                <Route
                  path="/projects"
                  element={<ProjectsPage projects={projects} />}
                />

                <Route
                  path="/projects/new"
                  element={
                    <ProjectFormPage
                      projects={projects}
                      yarns={yarns}
                      onSave={saveProject}
                    />
                  }
                />

                <Route
                  path="/projects/:id"
                  element={
                    <ProjectDetailsPage
                      projects={projects}
                      yarns={yarns}
                      onDelete={deleteProject}
                    />
                  }
                />

                <Route
                  path="/projects/:id/edit"
                  element={
                    <ProjectFormPage
                      projects={projects}
                      yarns={yarns}
                      onSave={saveProject}
                    />
                  }
                />

                <Route
                  path="*"
                  element={
                    <Typography component="h1" variant="h4">
                      Страница не найдена
                    </Typography>
                  }
                />
              </Routes>
              )}
          </Box>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}