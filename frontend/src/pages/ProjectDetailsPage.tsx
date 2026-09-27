import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { Link, useParams } from 'react-router-dom';

import YarnCard from '../components/YarnCard';
import type { Project, Yarn } from '../types';

interface ProjectDetailsPageProps {
  projects: Project[];
  yarns: Yarn[];
}

export default function ProjectDetailsPage({ projects, yarns }: ProjectDetailsPageProps) {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h4" component="h1">
          Проект не найден
        </Typography>

        <Button component={Link} to="/projects">
          Вернуться к проектам
        </Button>
      </Stack>
    );
  }

  const projectYarns = yarns.filter((yarn) =>
    project.yarnIds.includes(yarn.id),
  );

  return (
    <Stack spacing={3}>
      <Box>
        <Button component={Link} to="/projects">
          ← Мои проекты
        </Button>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={2}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {project.name}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {project.description}
          </Typography>
        </Box>

        <Button
          component={Link}
          to={`/projects/${project.id}/edit`}
          variant="outlined"
          sx={{ flexShrink: 0 }}
        >
          Редактировать
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Chip label={project.status} />
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h6" component="h2">
              Прогресс
            </Typography>

            <Typography>{project.progress}%</Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={project.progress}
            aria-label="Готовность изделия"
            sx={{ height: 8, borderRadius: 4 }}
          />

          <Typography variant="h6" component="h2">
            Заметки
          </Typography>

          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {project.notes || 'Пока нет заметок.'}
          </Typography>
        </Stack>
      </Paper>

      <Typography variant="h5" component="h2">
        Материалы
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
          },
          gap: 3,
        }}
      >
        {projectYarns.map((yarn) => (
          <YarnCard key={yarn.id} yarn={yarn} />
        ))}
      </Box>

      {projectYarns.length === 0 && (
        <Typography color="text.secondary">
          Пусто
        </Typography>
      )}
    </Stack>
  );
}