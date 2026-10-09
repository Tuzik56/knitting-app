import { useState } from 'react';
import type { FormEvent } from 'react';

import {
  Alert,
  Box,
  Button,
  Fade,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import type { Yarn } from '../../entities/yarn/types';

interface YarnFormProps {
  initialYarn?: Yarn;
  onSave: (yarn: Yarn) => void;
}


export default function YarnForm({ initialYarn, onSave }: YarnFormProps) {
  const navigate = useNavigate();

  const [name, setName] = useState(initialYarn?.name ?? '');
  const [brand, setBrand] = useState(initialYarn?.brand ?? '');
  const [composition, setComposition] = useState(
    initialYarn?.composition ?? '',
  );
  const [color, setColor] = useState(
    initialYarn?.color ?? '#9cae98',
  );
  const [weight, setWeight] = useState(
    String(initialYarn?.weight ?? 50),
  );
  const [length, setLength] = useState(
    String(initialYarn?.length ?? 100),
  );
  const [quantity, setQuantity] = useState(
    String(initialYarn?.quantity ?? 1),
  );
  const [notes, setNotes] = useState(initialYarn?.notes ?? '');
  const [error, setError] = useState('');

  const cancelPath = initialYarn
    ? `/yarns/${initialYarn.id}`
    : '/yarns';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Введите название пряжи');
      return;
    }

    if (name.trim().length > 200) {
      setError('Название пряжи должно содержать не больше 200 символов');
      return;
    }

    if (!brand.trim()) {
      setError('Введите производителя пряжи');
      return;
    }

    if (brand.trim().length > 200) {
      setError('Название производителя должно содержать не больше 200 символов');
      return;
    }

    if (!composition.trim()) {
      setError('Введите состав пряжи');
      return;
    }

    if (composition.trim().length > 300) {
      setError('Состав должен содержать не больше 300 символов');
      return;
    }

    const weightNumber = Number(weight);
    const lengthNumber = Number(length);
    const quantityNumber = Number(quantity);

    if (
      !weight.trim() ||
      !Number.isInteger(weightNumber) ||
      weightNumber <= 0
    ) {
      setError('Вес мотка должен быть целым числом больше нуля');
      return;
    }

    if (
      !length.trim() ||
      !Number.isInteger(lengthNumber) ||
      lengthNumber <= 0
    ) {
      setError('Длина нити должна быть целым числом больше нуля');
      return;
    }

    if (
      !quantity.trim() ||
      !Number.isInteger(quantityNumber) ||
      quantityNumber < 0
    ) {
      setError('Количество мотков должно быть целым числом не меньше нуля');
      return;
    }

    const savedYarn: Yarn = {
      id: initialYarn?.id ?? crypto.randomUUID(),
      name: name.trim(),
      brand: brand.trim(),
      composition: composition.trim(),
      color,
      weight: weightNumber,
      length: lengthNumber,
      quantity: quantityNumber,
      notes: notes.trim(),
    };

    onSave(savedYarn);
    navigate(`/yarns/${savedYarn.id}`);
  }

  return (
  <Fade in timeout={250}>
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        {initialYarn ? 'Редактирование пряжи' : 'Новая пряжа'}
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
            label="Название"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <TextField
            required
            fullWidth
            label="Производитель"
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
          />

          <TextField
            required
            fullWidth
            label="Состав"
            value={composition}
            onChange={(event) => setComposition(event.target.value)}
          />

          <TextField
            fullWidth
            type="color"
            label="Цвет нити"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            <TextField
              required
              label="Вес мотка, г"
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              slotProps={{
                htmlInput: { min: 1, step: 1 },
              }}
            />

            <TextField
              required
              label="Длина нити, м"
              type="number"
              value={length}
              onChange={(event) => setLength(event.target.value)}
              slotProps={{
                htmlInput: { min: 1, step: 1 },
              }}
            />

            <TextField
              required
              label="Количество мотков"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              slotProps={{
                htmlInput: { min: 0, step: 1 },
              }}
            />
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