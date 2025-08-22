import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/app/firebase/firebaseConfig';
import { useAppSelector } from '@/app/store/hooks';
import { CloudPreset, selectCurrentUser } from '@/features';

type UserData = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: Date;
};

export const useUserProfile = () => {
  const { uid } = useParams<{ uid: string }>();
  const currentUser = useAppSelector(selectCurrentUser);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPresets, setUserPresets] = useState<CloudPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDataAndPresets = async () => {
      if (!uid) {
        setError('User ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          let createdAt: Date;
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            createdAt = data.createdAt.toDate();
          } else if (typeof data.createdAt === 'string') {
            createdAt = new Date(data.createdAt);
          } else {
            createdAt = new Date();
          }
          const userData = {
            uid: userDoc.id,
            ...data,
            createdAt,
          } as UserData;
          setUserData(userData);
        } else {
          setError('User not found');
          setIsLoading(false);
          return;
        }

        const presetsQuery = query(
          collection(db, 'presets'),
          where('userId', '==', uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(presetsQuery);
        const presets: CloudPreset[] = [];

        querySnapshot.forEach(doc => {
          const presetData = doc.data();
          let createdAt: Date;
          if (
            presetData.createdAt &&
            typeof presetData.createdAt.toDate === 'function'
          ) {
            createdAt = presetData.createdAt.toDate();
          } else if (typeof presetData.createdAt === 'string') {
            createdAt = new Date(presetData.createdAt);
          } else {
            createdAt = new Date();
          }
          presets.push({
            id: doc.id,
            ...presetData,
            createdAt,
          } as unknown as CloudPreset);
        });

        setUserPresets(presets);
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndPresets();
  }, [uid]);

  return {
    userData,
    userPresets,
    isLoading,
    error,
    isCurrentUser: currentUser?.uid === uid,
    currentUser,
    uid,
  };
};
