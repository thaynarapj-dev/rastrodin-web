import axios from 'axios';
import { setApiAuthToken } from './api';
import { serviceConfig } from './config';

const authStorageKey = 'rastrodin.auth.session';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
  };
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: AuthUser;
}

type AuthResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: AuthUser;
};

export type AuthRedirectResult =
  | {
      type: 'session';
      session: AuthSession;
    }
  | {
      type: 'error';
      message: string;
    }
  | null;

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends AuthCredentials {
  name: string;
}

const authApi = axios.create({
  baseURL: serviceConfig.authUrl,
  headers: {
    'Content-Type': 'application/json',
    ...(serviceConfig.supabaseAnonKey
      ? {
          apikey: serviceConfig.supabaseAnonKey,
        }
      : {}),
  },
});

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.response?.data?.error_description ||
      error.response?.data?.error ||
      error.message ||
      'Não foi possível autenticar.';

    return Promise.reject(new Error(message));
  },
);

function ensureAuthConfig() {
  if (!serviceConfig.authUrl || !serviceConfig.supabaseAnonKey) {
    throw new Error('Configuração do Supabase Auth não encontrada.');
  }
}

function createSession(authResponse: AuthResponse): AuthSession {
  if (!authResponse.access_token || !authResponse.refresh_token || !authResponse.user) {
    throw new Error('Resposta de autenticação incompleta.');
  }

  const expiresAt = authResponse.expires_in
    ? Math.floor(Date.now() / 1000) + authResponse.expires_in
    : undefined;

  return {
    access_token: authResponse.access_token,
    refresh_token: authResponse.refresh_token,
    expires_at: expiresAt,
    user: authResponse.user,
  };
}

function saveSession(session: AuthSession) {
  localStorage.setItem(authStorageKey, JSON.stringify(session));
  setApiAuthToken(session.access_token);
}

function getAuthRedirectTo() {
  if (typeof window === 'undefined') return undefined;

  return window.location.origin;
}

function clearAuthHash() {
  if (typeof window === 'undefined' || !window.location.hash) return;

  window.history.replaceState(
    null,
    document.title,
    `${window.location.pathname}${window.location.search}`,
  );
}

async function getUserFromAccessToken(accessToken: string) {
  const { data } = await authApi.get<AuthUser>('/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}

export function clearAuthSession() {
  localStorage.removeItem(authStorageKey);
  setApiAuthToken(null);
}

export function getStoredSession() {
  const storedSession = localStorage.getItem(authStorageKey);

  if (!storedSession) return null;

  try {
    const session = JSON.parse(storedSession) as AuthSession;
    setApiAuthToken(session.access_token);
    return session;
  } catch {
    clearAuthSession();
    return null;
  }
}

export async function refreshAuthSession(session: AuthSession) {
  ensureAuthConfig();

  const { data } = await authApi.post<AuthResponse>('/token?grant_type=refresh_token', {
    refresh_token: session.refresh_token,
  });
  const refreshedSession = createSession(data);
  saveSession(refreshedSession);

  return refreshedSession;
}

export async function getCurrentAuthSession() {
  const storedSession = getStoredSession();

  if (!storedSession) return null;

  const expiresAt = storedSession.expires_at ?? 0;
  const shouldRefresh = expiresAt > 0 && expiresAt - Math.floor(Date.now() / 1000) < 60;

  if (!shouldRefresh) {
    return storedSession;
  }

  try {
    return await refreshAuthSession(storedSession);
  } catch {
    clearAuthSession();
    return null;
  }
}

export async function consumeAuthRedirectHash(): Promise<AuthRedirectResult> {
  if (typeof window === 'undefined' || !window.location.hash) return null;

  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const hashError = params.get('error');
  const hashErrorCode = params.get('error_code');
  const hashErrorDescription = params.get('error_description');

  if (hashError) {
    clearAuthHash();

    if (hashErrorCode === 'otp_expired') {
      return {
        type: 'error',
        message:
          'Esse link de confirmação expirou ou já foi usado. Faça login se a conta já foi confirmada, ou crie a conta novamente para receber um novo e-mail.',
      };
    }

    return {
      type: 'error',
      message: hashErrorDescription || 'Não foi possível confirmar seu e-mail.',
    };
  }

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken || !refreshToken) return null;

  try {
    const expiresIn = Number(params.get('expires_in') ?? 0);
    const user = await getUserFromAccessToken(accessToken);
    const session: AuthSession = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : undefined,
      user,
    };

    saveSession(session);
    clearAuthHash();

    return {
      type: 'session',
      session,
    };
  } catch {
    clearAuthHash();
    clearAuthSession();

    return {
      type: 'error',
      message: 'Seu e-mail foi confirmado, mas não foi possível iniciar a sessão automaticamente.',
    };
  }
}

export async function signIn({ email, password }: AuthCredentials) {
  ensureAuthConfig();

  const { data } = await authApi.post<AuthResponse>('/token?grant_type=password', {
    email,
    password,
  });
  const session = createSession(data);
  saveSession(session);

  return session;
}

export async function signUp({ name, email, password }: SignUpCredentials) {
  ensureAuthConfig();

  const redirectTo = getAuthRedirectTo();
  const { data } = await authApi.post<AuthResponse>(
    '/signup',
    {
      email,
      password,
      data: {
        name,
      },
    },
    {
      params: redirectTo
        ? {
            redirect_to: redirectTo,
          }
        : undefined,
    },
  );

  if (!data.access_token) {
    return null;
  }

  const session = createSession(data);
  saveSession(session);

  return session;
}

export async function signOut(session: AuthSession | null) {
  if (session?.access_token) {
    await authApi.post(
      '/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );
  }

  clearAuthSession();
}
