import { useState } from 'react';
import type { FormEvent } from 'react';

import {
  Alert,
  Box,
  Button,
  Fade,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';

import type {
  Project,
  ProjectStatus,
} from '../../entities/project/types';
import type { Yarn } from '../../entities/yarn/types';

interface ProjectFormProps {
  initialProject?: Project;
  yarns: Yarn[];
  onSave: (project: Project) => void;
}

export default function ProjectForm({
  initialProject,
  yarns,
  onSave,
}: ProjectFormProps) {
  const navigate = useNavigate();

  const [name, setName] = useState(initialProject?.name ?? '');
  const [description, setDescription] = useState(
    initialProject?.description ?? '',
  );
  const [status, setStatus] = useState<ProjectStatus>(
    initialProject?.status ?? 'В планах',
  );
  const [progress, setProgress] = useState(
    initialProject?.progress ?? 0,
  );
  const [yarnIds, setYarnIds] = useState<string[]>(
    initialProject?.yarnIds ?? [],
  );
  const [notes, setNotes] = useState(initialProject?.notes ?? '');
  const [error, setError] = useState('');

  const cancelPath = initialProject
    ? `/projects/${initialProject.id}`
    : '/projects';

  function changeStatus(nextStatus: ProjectStatus) {
    setStatus(nextStatus);

    if (nextStatus === 'В планах') {
      setProgress(0);
    } else if (nextStatus === 'Завершен') {
      setProgress(100);
    } else {
      setProgress((current) => Math.min(current, 99));
    }
  }

  function changeProgress(nextProgress: number) {
    setProgress(nextProgress);

    if (nextProgress === 100) {
      setStatus('Завершен');
    } else if (nextProgress === 0) {
        setStatus('В планах');
    } else if (nextProgress > 0) {
      setStatus('В процессе');
    } else {
      setStatus((current) =>
        current === 'Завершен' ? 'В планах' : current,
      );
    }
  }

  function toggleYarn(yarnId: string, checked: boolean) {
    setYarnIds((currentIds) => {
      if (checked) {
        return currentIds.includes(yarnId)
          ? currentIds
          : [...currentIds, yarnId];
      }

      return currentIds.filter((id) => id !== yarnId);
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Введите название проекта');
      return;
    }

    if (name.trim().length > 200) {
      setError('Название проекта должно содержать не больше 200 символов');
      return;
    }

    if (
      !Number.isInteger(progress) ||
      progress < 0 ||
      progress > 100
    ) {
      setError('Готовность проекта должна быть целым числом от 0 до 100');
      return;
    }

    if (yarnIds.some((id) => !yarns.some((yarn) => yarn.id === id))) {
      setError('Выбранная пряжа больше не доступна. Откройте форму заново');
      return;
    }

    const savedProject: Project = {
      id: initialProject?.id ?? crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      status,
      progress,
      yarnIds,
      notes: notes.trim(),
    };

    onSave(savedProject);
    navigate(`/projects/${savedProject.id}`);
  }

  return (
  <Fade in timeout={250}>
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        {initialProject ? 'Редактирование проекта' : 'Новый проект'}
      </Typography>

      <Paper
        component="form"
        noValidate
        variant="outlined"
        onSubmit={handleSubmit}
        sx={{ p: { xs: 2, sm: 3 }, maxWidth: 800 }}
      >
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            required
            fullWidth
            label="Название проекта"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Описание изделия"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <TextField
            select
            fullWidth
            label="Статус"
            value={status}
            onChange={(event) =>
              changeStatus(event.target.value as ProjectStatus)
            }
          >
            <MenuItem value="В планах">В планах</MenuItem>
            <MenuItem value="В процессе">В процессе</MenuItem>
            <MenuItem value="Завершен">Завершен</MenuItem>
          </TextField>

          <Box>
            <Typography id="project-progress-label" gutterBottom>
              Прогресс {progress}%
            </Typography>

            <Slider
              aria-labelledby="project-progress-label"
              min={0}
              max={100}
              step={1}
              value={progress}
              valueLabelDisplay="auto"
              onChange={(_, value) => {
                if (typeof value === 'number') {
                  changeProgress(value);
                }
              }}
            />
          </Box>

          <Box
            component="section"
            aria-labelledby="project-yarns-title"
          >
            <Typography
              id="project-yarns-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Пряжа
            </Typography>

            <FormGroup>
              {yarns.map((yarn) => (
                <FormControlLabel
                  key={yarn.id}
                  control={
                    <Checkbox
                      checked={yarnIds.includes(yarn.id)}
                      onChange={(_, checked) =>
                        toggleYarn(yarn.id, checked)
                      }
                    />
                  }
                  label={`${yarn.brand} · ${yarn.name}`}
                />
              ))}
            </FormGroup>

            {yarns.length === 0 && (
              <Alert severity="info">
                В каталоге пока нет пряжи. Можно сохранить проект без материалов и выбрать их позже.
              </Alert>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Заметки"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="flex-end"
            spacing={1}
          >
            <Button component={Link} to={cancelPath}>
              Отмена
            </Button>

            <Button type="submit" variant="contained">
              Сохранить
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  </Fade>
  );
}