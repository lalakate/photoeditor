import { ActiveFilters } from '@/features';
import { Timestamp } from 'firebase/firestore';

export type CloudPreset = {
  id: string;
  name: string;
  filters: ActiveFilters;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  previewUrl: string;
  downloads: number;
};

export type CreatePresetData = {
  name: string;
  filters: ActiveFilters;
};
