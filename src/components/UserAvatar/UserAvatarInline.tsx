import React from 'react';
import { Link } from 'react-router-dom';
import './user-avatar.css';

interface UserAvatarInlineProps {
  userId: string;
  displayName: string;
  photoURL?: string;
  email?: string;
}

const UserAvatarInline: React.FC<UserAvatarInlineProps> = ({
  userId,
  displayName,
  photoURL,
  email,
}) => {
  const getInitials = (displayName?: string, email?: string) => {
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
  const initials = getInitials(displayName, email);
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

export default UserAvatarInline;
