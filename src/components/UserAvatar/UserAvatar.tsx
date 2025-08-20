import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../store/hooks';
import './user-avatar.css';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase/firebaseConfig';
import { Link } from 'react-router-dom';

const UserAvatar: React.FC = () => {
  const { logout } = useAuth();
  const { user } = useAppSelector(state => state.auth);

  if (!user) return null;

  const getInitials = (displayName: string | null, email: string | null) => {
    if (displayName) {
      return displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const avatarUrl = user.photoURL;
  const initials = getInitials(user.displayName, user.email);

  return (
    <div className="user-avatar-container">
      <Link to={`/users/${user.uid}`}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="user-avatar-image"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="user-avatar-initials">{initials}</div>
        )}
      </Link>
    </div>
  );
};

export default UserAvatar;
