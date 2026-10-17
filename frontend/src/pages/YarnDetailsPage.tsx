import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Yarn } from '../entities/yarn/types';
import type { Project } from '../entities/project/types';
import DeleteConfirmDialog from '../shared/ui/DeleteConfirmDialog';

interface YarnDetailsPageProps {
  yarns: Yarn[];
  projects: Project[];
  onDelete: (id: string) => Promise<void>;
}

export default function YarnDetailsPage({ yarns, projects, onDelete }: YarnDetailsPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const yarn = yarns.find((item) => item.id === id);

  const usedInProjects = projects.filter((project) =>
    project.yarnIds.includes(id ?? ''),
  );

  const isUsed = usedInProjects.length > 0;

  if (!yarn) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h4" component="h1">
          Пряжа не найдена
        </Typography>

        <Button component={Link} to="/yarns">
          Вернуться в каталог
        </Button>
      </Stack>
    );
  }

  async function handleDelete() {
    if (!yarn || deleting) return;

    setDeleting(true);
    setDeleteError('');

    try {
      await onDelete(yarn.id);
      navigate('/yarns', { replace: true });
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : 'Не удалось удалить пряжу.',
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Button component={Link} to="/yarns">
          ← Каталог пряжи
        </Button>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography variant="overline" color="text.secondary">
            {yarn.brand}
          </Typography>

          <Typography variant="h4" component="h1">
            {yarn.name}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
        >
          <Button
            component={Link}
            to={`/yarns/${yarn.id}/edit`}
            variant="outlined"
          >
            Редактировать
          </Button>

          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              setDeleteError('');
              setDeleteDialogOpen(true);
            }}
          >
            Удалить
          </Button>
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography>
            <strong>Состав:</strong> {yarn.composition}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>
              <strong>Цвет:</strong> {yarn.color}
            </Typography>

            <Box
              aria-hidden="true"
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: yarn.color,
                border: '1px solid #00000020',
              }}
            />
          </Stack>

          <Typography>
            <strong>Вес мотка:</strong> {yarn.weight} г
          </Typography>

          <Typography>
            <strong>Длина нити:</strong> {yarn.length} м
          </Typography>

          <Typography>
            <strong>Количество:</strong> {yarn.quantity} шт
          </Typography>

          <Typography variant="h6" component="h2">
            Заметки
          </Typography>

          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {yarn.notes || 'Пусто'}
          </Typography>
        </Stack>
      </Paper>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title={isUsed ? 'Удаление недоступно' : 'Удалить пряжу?'}
        confirmDisabled={isUsed || deleting}
        description={
          isUsed ? (
            <>
              <Typography>
                Пряжа используется в проектах:
              </Typography>

              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 3 }}>
                {usedInProjects.map((project) => (
                  <li key={project.id}>
                    <Link
                      to={`/projects/${project.id}`}
                      style={{ textDecoration: 'underline' }}
                    >
                      {project.name}
                    </Link>
                  </li>
                ))}
              </Box>
            </>
          ) : deleteError ? (
            <Typography>{deleteError}</Typography>
          ) : (
            <Typography>
              Пряжа «{yarn.name}» будет удалена
            </Typography>
          )
        }
        onClose={() => {
          if (!deleting) {
            setDeleteDialogOpen(false);
            setDeleteError('');
          }
        }}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}