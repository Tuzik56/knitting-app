const API_URL = 'http://127.0.0.1:8000';

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

interface AccessToken {
  access_token: string;
}

interface User {
  id: number;
  username: string;
}

export interface AuthSession {
  user: User;
  request: <T>(path: string, options?: RequestInit) => Promise<T>;
  logout: () => Promise<void>;
}

async function send(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error('Не удалось связаться с сервером.');
  }
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);

    const message =
      typeof data === 'object' &&
      data !== null &&
      'detail' in data &&
      typeof data.detail === 'string'
        ? data.detail
        : response.status === 422
          ? 'Проверьте введённые данные и выбранные материалы.'
          : `Ошибка запроса: ${response.status}`;

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function registerUser(
  username: string,
  password: string,
): Promise<User> {
  return readResponse<User>(
    await send('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),
  );
}

export async function signIn(
  username: string,
  password: string,
  onExpired: () => void,
): Promise<AuthSession> {
  const tokens = await readResponse<TokenPair>(
    await send('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),
  );

  let accessToken = tokens.access_token;
  let refreshToken = tokens.refresh_token;
  let active = true;
  let refreshTask: Promise<void> | null = null;

  function expire() {
    active = false;
    accessToken = '';
    refreshToken = '';
    onExpired();
  }

  async function refreshAccess() {
    const response = await send('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.status === 401) {
      expire();
      throw new Error('Сессия истекла. Войдите заново.');
    }

    const data = await readResponse<AccessToken>(response);

    if (!active) {
      throw new Error('Сессия завершена.');
    }

    accessToken = data.access_token;
  }

  async function request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    if (!active) {
      throw new Error('Сессия завершена.');
    }

    const tokenUsed = accessToken;

    function authorizedRequest() {
      const headers = new Headers(options.headers);
      headers.set('Authorization', `Bearer ${accessToken}`);

      if (options.body) {
        headers.set('Content-Type', 'application/json');
      }

      return send(path, { ...options, headers });
    }

    let response = await authorizedRequest();

    if (response.status === 401) {
      if (!active) {
        throw new Error('Сессия завершена.');
      }

      if (accessToken === tokenUsed) {
        if (!refreshTask) {
          refreshTask = refreshAccess().finally(() => {
            refreshTask = null;
          });
        }

        await refreshTask;
      }

      if (!active) {
        throw new Error('Сессия завершена.');
      }

      response = await authorizedRequest();

      if (response.status === 401) {
        expire();
        throw new Error('Войдите заново.');
      }
    }

    if (!active) {
      throw new Error('Сессия завершена.');
    }

    return readResponse<T>(response);
  }

  const user = await request<User>('/auth/me');

  async function logout() {
    await readResponse<void>(
      await send('/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }),
    );

    active = false;
    accessToken = '';
    refreshToken = '';
  }

  return { user, request, logout };
}