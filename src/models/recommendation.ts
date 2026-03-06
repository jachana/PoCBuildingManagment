import { PublicUser } from './user';

export type RecommendationCategory =
  | 'NANNY'
  | 'TRANSPORTATION'
  | 'DOG_WALKER'
  | 'DECORATOR'
  | 'ELECTRICIAN'
  | 'GARDENER'
  | 'PERSONAL_TRAINER'
  | 'PLUMBER'
  | 'CLEANER'
  | 'OTHER';

export interface Recommendation {
  id: string;
  serviceName: string;
  category: RecommendationCategory;
  rating: number;
  comment: string;
  contactInfo: string | null;
  author: PublicUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecommendationData {
  serviceName: string;
  category: RecommendationCategory;
  rating: number;
  comment: string;
  contactInfo?: string;
}
