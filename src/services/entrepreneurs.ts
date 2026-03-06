import { apiFetch } from './api';
import { EntrepreneurProfile, CreateEntrepreneurData } from '@/models/entrepreneur';
import { PaginatedResponse } from '@/models/post';

interface Filters {
  category?: string;
  page?: number;
  limit?: number;
}

export async function getEntrepreneurs(filters: Filters = {}): Promise<PaginatedResponse<EntrepreneurProfile>> {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  const query = params.toString();
  return apiFetch<PaginatedResponse<EntrepreneurProfile>>(`/entrepreneurs${query ? `?${query}` : ''}`);
}

export async function getEntrepreneur(id: string): Promise<EntrepreneurProfile> {
  return apiFetch<EntrepreneurProfile>(`/entrepreneurs/${id}`);
}

export async function createEntrepreneurProfile(data: CreateEntrepreneurData): Promise<EntrepreneurProfile> {
  return apiFetch<EntrepreneurProfile>('/entrepreneurs', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateEntrepreneurProfile(id: string, data: Partial<CreateEntrepreneurData>): Promise<EntrepreneurProfile> {
  return apiFetch<EntrepreneurProfile>(`/entrepreneurs/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteEntrepreneurProfile(id: string): Promise<void> {
  return apiFetch<void>(`/entrepreneurs/${id}`, { method: 'DELETE' });
}
