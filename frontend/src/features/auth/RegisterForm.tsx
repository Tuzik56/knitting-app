import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { registerUser } from '../../shared/api/client';

interface RegisterFormProps {
  onRegistered: (username: string) => void;
  onLogin: () => void;
}

export default function RegisterForm({
  onRegistered,
  onLogin,
}: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const normalizedUsername = username.trim().toLowerCase();

    if (!/^[a-z0-9_-]{3,50}$/.test(normalizedUsername)) {
      setError('Логин: от 3 до 50 символов — латинские буквы, цифры, дефис или подчёркивание.');
      return;
    }

    const passwordLength = [...password].length;
    if (passwordLength < 8 || passwordLength > 128 || !password.trim()) {
      setError('Пароль должен содержать от 8 до 128 символов и не состоять только из пробелов.');
      return;
    }

    setError('');
    setPending(true);

    try {
      const user = await registerUser(normalizedUsername, password);
      onRegistered(user.username);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Не удалось зарегистрироваться.',
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        noValidate
        variant="outlined"
        sx={{ p: 3 }}
      >
        <Stack spacing={3}>
          <Typography variant="h5" component="h1">
            Регистрация
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Логин"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            helperText="3–50 символов: латинские буквы, цифры, дефис, подчёркивание"
            required
            disabled={pending}
          />

          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            helperText="От 8 до 128 символов"
            required
            disabled={pending}
          />

          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? 'Регистрация…' : 'Зарегистрироваться'}
          </Button>

          <Button type="button" onClick={onLogin} disabled={pending}>
            Уже есть аккаунт? Войти
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
