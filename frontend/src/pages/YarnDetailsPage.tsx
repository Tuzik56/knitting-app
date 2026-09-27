import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { Link, useParams } from 'react-router-dom';
import type { Yarn } from '../types';

interface YarnDetailsPageProps {
  yarns: Yarn[];
}

export default function YarnDetailsPage({ yarns }: YarnDetailsPageProps) {
  const { id } = useParams();
  const yarn = yarns.find((item) => item.id === id);

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

        <Button
          component={Link}
          to={`/yarns/${yarn.id}/edit`}
          variant="outlined"
        >
          Редактировать
        </Button>
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

          <Typography variant="h7" component="h2">
            Заметки
          </Typography>

          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {yarn.notes || 'Пусто'}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}