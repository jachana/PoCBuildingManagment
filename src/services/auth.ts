import { apiFetch, storeTokens, clearTokens } from './api';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    displayName: string;
    role: string;
    approved: boolean;
    buildingId: string;
  };
}

interface RegisterResponse {
  id: string;
  email: string;
  displayName: string;
  role: string;
  approved: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  displayName: string;
  unitNumber: string;
  buildingId: string;
  phone?: string;
}

export async function login(data: LoginData): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  await storeTokens(response.accessToken, response.refreshToken);
  return response;
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<void> {
  await clearTokens();
}

export async function getMe() {
  return apiFetch<{
    id: string;
    email: string;
    displayName: string;
    fullName: string;
    phone: string | null;
    unitNumber: string;
    avatarUrl: string | null;
    role: string;
    approved: boolean;
    buildingId: string;
  }>('/users/me');
}
