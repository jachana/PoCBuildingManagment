import { apiFetch } from './api';
import { Post, CreatePostData, UpdatePostData, PaginatedResponse } from '@/models/post';

interface PostFilters {
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getPosts(filters: PostFilters = {}): Promise<PaginatedResponse<Post>> {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.status) params.set('status', filters.status);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  const query = params.toString();
  return apiFetch<PaginatedResponse<Post>>(`/posts${query ? `?${query}` : ''}`);
}

export async function getPost(id: string): Promise<Post> {
  return apiFetch<Post>(`/posts/${id}`);
}

export async function createPost(data: CreatePostData): Promise<Post> {
  return apiFetch<Post>('/posts', { method: 'POST', body: JSON.stringify(data) });
}

export async function updatePost(id: string, data: UpdatePostData): Promise<Post> {
  return apiFetch<Post>(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
