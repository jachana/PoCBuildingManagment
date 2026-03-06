import { PublicUser } from './user';

export type PostCategory =
  | 'FURNITURE'
  | 'ELECTRONICS'
  | 'HOME_APPLIANCES'
  | 'CLOTHING'
  | 'SPORTS'
  | 'BOOKS'
  | 'MOVING_ITEMS'
  | 'OTHER';

export type PostStatus = 'ACTIVE' | 'SOLD' | 'REMOVED' | 'EXPIRED';

export interface Post {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: PostCategory;
  images: string[];
  status: PostStatus;
  author: PublicUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  description: string;
  price: number;
  category: PostCategory;
  images: string[];
}

export interface UpdatePostData {
  title?: string;
  description?: string;
  price?: number;
  category?: PostCategory;
  status?: 'SOLD';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
