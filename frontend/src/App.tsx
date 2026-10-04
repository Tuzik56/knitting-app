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
import { useState } from 'react';
import type { Yarn, Project } from './types';
import { demoYarns, demoProjects } from './data/demo';
import YarnDetailsPage from './pages/YarnDetailsPage';
import YarnFormPage from './pages/YarnFormPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectFormPage from './pages/ProjectFormPage';

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
    const [yarns, setYarns] = useState<Yarn[]>(demoYarns);
    const [projects, setProjects] = useState<Project[]>(demoProjects);

    function saveYarn(savedYarn: Yarn) {
      setYarns((currentYarns) => {
        const exists = currentYarns.some(
          (yarn) => yarn.id === savedYarn.id,
        );

        if (exists) {
          return currentYarns.map((yarn) =>
            yarn.id === savedYarn.id ? savedYarn : yarn,
          );
        }

        return [...currentYarns, savedYarn];
      });
    }

    function saveProject(savedProject: Project) {
      setProjects((currentProjects) => {
        const exists = currentProjects.some(
          (project) => project.id === savedProject.id,
        );

        if (exists) {
          return currentProjects.map((project) =>
            project.id === savedProject.id ? savedProject : project,
          );
        }

        return [...currentProjects, savedProject];
      });
    }

    function deleteYarn(id: string): boolean {
      const isUsed = projects.some((project) =>
        project.yarnIds.includes(id),
      );

      if (isUsed) {
        return false;
      }

      setYarns((currentYarns) =>
        currentYarns.filter((yarn) => yarn.id !== id),
      );

      return true;
    }

    function deleteProject(id: string) {
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== id),
      );
    }

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
          </Box>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}