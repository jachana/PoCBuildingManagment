import { PublicUser } from './user';

export type EntrepreneurCategory =
  | 'LEGAL'
  | 'HEALTH'
  | 'DESIGN'
  | 'COACHING'
  | 'PHOTOGRAPHY'
  | 'EDUCATION'
  | 'TECHNOLOGY'
  | 'BEAUTY'
  | 'FITNESS'
  | 'OTHER';

export interface EntrepreneurProfile {
  id: string;
  profession: string;
  category: EntrepreneurCategory;
  description: string;
  contactInfo: string;
  avatarUrl: string | null;
  residentDiscount: string | null;
  active: boolean;
  user: PublicUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntrepreneurData {
  profession: string;
  category: EntrepreneurCategory;
  description: string;
  contactInfo: string;
  avatarUrl?: string;
  residentDiscount?: string;
}
