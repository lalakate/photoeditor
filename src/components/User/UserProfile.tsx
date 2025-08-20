import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useAppSelector } from '../../store/hooks';
import PresetGrid from './PresetGrid';
import './user-profile.css';
import { CloudPreset } from '../../services/presetService';
import { Loader } from '../UI/Loader/Loader';

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: Date;
}

const UserProfile: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const currentUser = useAppSelector(state => state.auth.user);
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

        // Получаем данные пользователя
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

        // Получаем пресеты пользователя
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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!userData) {
    return <div className="error-message">User not found</div>;
  }

  const isCurrentUser = currentUser?.uid === uid;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.photoURL ? (
            <img
              src={userData.photoURL}
              alt={userData.displayName || 'User'}
              className="avatar-image"
            />
          ) : (
            <div className="avatar-placeholder">
              {userData.displayName?.[0] || userData.email?.[0] || 'U'}
            </div>
          )}
        </div>

        <div className="profile-info">
          <h1 className="profile-name">
            {userData.displayName || userData.email.split('@')[0]}
          </h1>
          <p className="profile-email">{userData.email}</p>
          <p className="profile-stats">
            {userPresets.length} presets • Joined{' '}
            {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="profile-content">
        <h2>{isCurrentUser ? 'My Presets' : 'User Presets'}</h2>
        {userPresets.length > 0 ? (
          <PresetGrid presets={userPresets} />
        ) : (
          <div className="empty-state">
            <p>No presets yet</p>
            {isCurrentUser && (
              <Link to="/" className="create-preset-button">
                Create Your First Preset
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
