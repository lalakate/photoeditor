import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getInitials } from './getInitials';
import './user-avatar.css';

interface UserAvatarInlineProps {
  userId: string;
  displayName: string;
  photoURL?: string;
  email?: string;
}

export const UserAvatarInline: React.FC<UserAvatarInlineProps> = ({
  userId,
  displayName,
  photoURL,
  email,
}) => {
  const initials = useMemo(
    () => getInitials(displayName, email ?? null),
    [displayName, email]
  );

  return (
    <Link to={`/users/${userId}`} className="user-avatar-inline">
      {photoURL ? (
        <img
          src={photoURL}
          alt={displayName || 'User'}
          className="user-avatar-image user-avatar-inline-img"
        />
      ) : (
        <div className="user-avatar-initials user-avatar-inline-img">
          {initials}
        </div>
      )}
    </Link>
  );
};
