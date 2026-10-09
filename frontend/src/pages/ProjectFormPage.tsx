import { Button, Stack, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import type { Project } from '../entities/project/types';
import type { Yarn } from '../entities/yarn/types';
import ProjectForm from '../features/project-form/ProjectForm';

interface ProjectFormPageProps {
  projects: Project[];
  yarns: Yarn[];
  onSave: (project: Project) => void;
}

export default function ProjectFormPage({
  projects,
  yarns,
  onSave,
}: ProjectFormPageProps) {
  const { id } = useParams();

  const existingProject = projects.find(
    (project) => project.id === id,
  );

  if (id && !existingProject) {
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

  return (
    <ProjectForm
      key={id ?? 'new'}
      initialProject={existingProject}
      yarns={yarns}
      onSave={onSave}
    />
  );
}