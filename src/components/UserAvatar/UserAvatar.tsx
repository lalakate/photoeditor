import React from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { selectUser } from '@/features';
import { Link } from 'react-router-dom';
import { getInitials } from './getInitials';
import './user-avatar.css';

export const UserAvatar: React.FC = () => {
  const user = useAppSelector(selectUser);

  if (!user) return null;

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
