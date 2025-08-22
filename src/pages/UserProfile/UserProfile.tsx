import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '@/shared/hooks';
import { Loader } from '@/shared/ui';
import { getUsernameFromEmail } from '@/shared/utils';
import { PresetGrid } from '@/components/User';
import './user-profile.css';

export const UserProfile: React.FC = () => {
  const { isLoading, error, userData, userPresets, uid, currentUser } =
    useUserProfile();

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
            {userData.displayName || getUsernameFromEmail(userData.email)}
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
