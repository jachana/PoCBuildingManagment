export interface User {
  id: string;
  email: string;
  displayName: string;
  fullName: string;
  phone: string | null;
  unitNumber: string;
  avatarUrl: string | null;
  role: 'PENDING' | 'RESIDENT' | 'ADMIN' | 'BUILDING_MANAGER';
  approved: boolean;
  buildingId: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}
