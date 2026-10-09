import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import { Link } from 'react-router-dom';
import type { Project } from './types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea
        component={Link}
        to={`/projects/${project.id}`}
        aria-label={`Открыть проект ${project.name}`}
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ p: 3 }}>
          <Chip
            label={project.status}
            size="small"
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" component="h2" gutterBottom>
            {project.name}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3, whiteSpace: 'pre-wrap' }}
          >
            {project.description}
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 1 }}
          >
            <Typography variant="body2">
              Прогресс
            </Typography>

            <Typography variant="body2">
              {project.progress}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={project.progress}
            aria-label="Прогресс"
            sx={{ height: 8, borderRadius: 4 }}
          />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            Материалы: {project.yarnIds.length} шт
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}