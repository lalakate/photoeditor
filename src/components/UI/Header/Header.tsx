import { analytics } from '@/app/firebase/firebaseConfig';
import { useAppSelector } from '@/app/store/hooks';
import { selectIsAuthorized, selectUser, useAuth } from '@/features';
import { getUsernameFromEmail } from '@/shared/utils';
import { logEvent } from 'firebase/analytics';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserAvatar } from '../../UserAvatar';
import './header.css';

export const Header = () => {
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const user = useAppSelector(selectUser);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();

    logEvent(analytics, 'user_logout');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="logo" />
        </Link>

        {isAuthorized ? (
          <div className="header-user-content">
            <span className="user-greeting">
              Welcome,{' '}
              {user?.displayName || getUsernameFromEmail(user?.email ?? '')}!
            </span>
            <UserAvatar />
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className={
              location.pathname.startsWith('/auth')
                ? 'login-link active'
                : 'login-link'
            }
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
