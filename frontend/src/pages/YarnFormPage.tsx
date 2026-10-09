import { Button, Stack, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import type { Yarn } from '../entities/yarn/types';
import YarnForm from '../features/yarn-form/YarnForm';

interface YarnFormPageProps {
  yarns: Yarn[];
  onSave: (yarn: Yarn) => void;
}

export default function YarnFormPage({ yarns, onSave }: YarnFormPageProps) {
  const { id } = useParams();
  const existingYarn = yarns.find((yarn) => yarn.id === id);

  if (id && !existingYarn) {
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

  return (
    <YarnForm
      key={id ?? 'new'}
      initialYarn={existingYarn}
      onSave={onSave}
    />
  );
}