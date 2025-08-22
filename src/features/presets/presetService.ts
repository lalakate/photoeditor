import { analytics, db } from '@/app/firebase/firebaseConfig';
import { generatePresetPreview } from '@/shared/utils';
import { logEvent } from 'firebase/analytics';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { CloudPreset, CreatePresetData } from './types';

export class PresetService {
  private static COLLECTION_NAME = 'presets';

  static async savePreset(
    userId: string,
    userName: string,
    presetData: CreatePresetData,
    userPhotoURL?: string
  ): Promise<CloudPreset> {
    try {
      const previewUrl = await generatePresetPreview(presetData.filters);

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
        name: presetData.name,
        filters: presetData.filters,
        userId,
        userName,
        userPhotoURL: userPhotoURL || '',
        previewUrl,
        downloads: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const savedPreset: CloudPreset = {
        id: docRef.id,
        name: presetData.name,
        filters: presetData.filters,
        userId,
        userName,
        userPhotoURL: userPhotoURL || '',
        previewUrl,
        downloads: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      return savedPreset;
    } catch (error) {
      logEvent(analytics, 'save_preset_error', {
        userId,
        message: (error as Error).message,
      });
      console.error('Error saving preset:', error);

      throw new Error('Failed to save preset');
    }
  }

  static async getUserPresets(userId: string): Promise<CloudPreset[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const presets: CloudPreset[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        presets.push({
          id: doc.id,
          name: data.name,
          filters: data.filters,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          previewUrl: data.previewUrl,
          downloads: data.downloads || 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as CloudPreset);
      });

      return presets;
    } catch (error) {
      logEvent(analytics, 'fetch_user_presets_error', {
        userId,
        message: (error as Error).message,
      });

      throw new Error('Failed to fetch presets');
    }
  }

  static async getPublicPresets(): Promise<CloudPreset[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('downloads', 'desc'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const presets: CloudPreset[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        presets.push({
          id: doc.id,
          name: data.name,
          filters: data.filters,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          previewUrl: data.previewUrl,
          downloads: data.downloads || 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as CloudPreset);
      });

      logEvent(analytics, 'fetch_public_presets', {
        count: presets.length,
      });

      return presets;
    } catch (error) {
      logEvent(analytics, 'fetch_public_presets_error', {
        message: (error as Error).message,
      });

      throw new Error('Failed to fetch public presets');
    }
  }

  static async deletePreset(presetId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, presetId));

      logEvent(analytics, 'preset_deleted', { presetId });
    } catch (error) {
      logEvent(analytics, 'delete_preset_error', {
        message: (error as Error).message,
      });

      throw new Error('Failed to delete preset');
    }
  }

  static async incrementDownloads(presetId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.COLLECTION_NAME, presetId), {
        downloads: increment(1),
        updatedAt: serverTimestamp(),
      });
      logEvent(analytics, 'preset_downloaded', { presetId });
    } catch (error) {
      logEvent(analytics, 'increment_downloads_error', {
        presetId,
        message: (error as Error).message,
      });
      throw new Error('Failed to increment downloads');
    }
  }
}
export type { CloudPreset };

export type { CreatePresetData };
