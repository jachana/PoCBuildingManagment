import { apiFetch } from './api';
import { Recommendation, CreateRecommendationData } from '@/models/recommendation';
import { PaginatedResponse } from '@/models/post';

interface Filters {
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getRecommendations(filters: Filters = {}): Promise<PaginatedResponse<Recommendation>> {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  const query = params.toString();
  return apiFetch<PaginatedResponse<Recommendation>>(`/recommendations${query ? `?${query}` : ''}`);
}

export async function getRecommendation(id: string): Promise<Recommendation> {
  return apiFetch<Recommendation>(`/recommendations/${id}`);
}

export async function createRecommendation(data: CreateRecommendationData): Promise<Recommendation> {
  return apiFetch<Recommendation>('/recommendations', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateRecommendation(id: string, data: Partial<CreateRecommendationData>): Promise<Recommendation> {
  return apiFetch<Recommendation>(`/recommendations/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
