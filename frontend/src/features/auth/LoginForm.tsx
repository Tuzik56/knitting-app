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

interface LoginFormProps {
  initialUsername?: string;
  successMessage?: string;
  sessionMessage?: string;
  onRegister: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
}

export default function LoginForm({
  onLogin,
  onRegister,
  initialUsername = '',
  successMessage = '',
  sessionMessage = '',
}: LoginFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    if (!username.trim() || !password) {
      setError('Введите логин и пароль.');
      return;
    }

    setError('');
    setPending(true);

    try {
      await onLogin(username, password);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Не удалось войти.',
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
            Вход
          </Typography>

          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {sessionMessage && <Alert severity="warning">{sessionMessage}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Логин"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
            disabled={pending}
          />

          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            disabled={pending}
          />

          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? 'Вход…' : 'Войти'}
          </Button>
          <Button type="button" onClick={onRegister} disabled={pending}>
            Создать аккаунт
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}