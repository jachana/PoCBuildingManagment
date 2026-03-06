import { Platform } from 'react-native';

const DEFAULT_API_URL = Platform.OS === 'web'
  ? 'https://api.bm.latam.juliocode.com/api/v1'
  : 'http://localhost:3000/api/v1';

const API_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

// Storage abstraction: SecureStore on native, localStorage on web
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    const SecureStore = await import('expo-secure-store');
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync(key, value);
  },
  deleteItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    const SecureStore = await import('expo-secure-store');
    await SecureStore.deleteItemAsync(key);
  },
};

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function getToken(): Promise<string | null> {
  return storage.getItem('accessToken');
}

async function getRefreshToken(): Promise<string | null> {
  return storage.getItem('refreshToken');
}

async function storeTokens(accessToken: string, refreshToken: string): Promise<void> {
  await storage.setItem('accessToken', accessToken);
  await storage.setItem('refreshToken', refreshToken);
}

export async function clearTokens(): Promise<void> {
  await storage.deleteItem('accessToken');
  await storage.deleteItem('refreshToken');
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      await clearTokens();
      return null;
    }
    const data = await response.json();
    await storeTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    await clearTokens();
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let token = await getToken();

  const doFetch = async (authToken: string | null) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return fetch(`${API_URL}${path}`, { ...options, headers });
  };

  let response = await doFetch(token);

  if (response.status === 401 && token) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();
    }
    const newToken = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (newToken) {
      response = await doFetch(newToken);
    } else {
      throw new ApiError(401, 'UNAUTHORIZED', 'Session expired');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.error?.code || 'UNKNOWN_ERROR',
      errorData.error?.message || 'Request failed',
      errorData.error?.details,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Array<{ field?: string; message: string }>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export { storeTokens, getToken };
