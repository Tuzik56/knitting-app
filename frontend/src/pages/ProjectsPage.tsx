import { Box, Typography, Button, Stack } from '@mui/material';

import ProjectCard from '../entities/project/ProjectCard';
import type { Project } from '../entities/project/types';

import { Link } from 'react-router-dom';

interface ProjectsPageProps {
  projects: Project[];
}

export default function ProjectsPage({ projects }: ProjectsPageProps) {
  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Мои проекты
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/projects/new"
          variant="contained"
        >
          Новый проект
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
          },
          gap: 3,
        }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Box>

      {projects.length === 0 && (
        <Typography color="text.secondary">
          У вас пока нет проектов. Нажмите «Новый проект», чтобы добавить первое изделие
        </Typography>
      )}
    </>
  );
}