import { useAppSelector } from '../../../store/hooks';
import { Link, useNavigate } from 'react-router-dom';
import UserAvatar from '../../UserAvatar/UserAvatar';
import { useAuth } from '../../../hooks/useAuth';
import { analytics } from '../../../firebase/firebaseConfig';
import { logEvent } from 'firebase/analytics';
import './header.css';

export const Header = () => {
  const { isAuthorized, user, isRegistering } = useAppSelector(
    state => state.auth
  );
  const { logout } = useAuth();
  const navigate = useNavigate();

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
              Welcome, {user?.displayName || user?.email?.split('@')[0]}!
            </span>
            <UserAvatar />
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          <Link to="/auth" className="login-link">
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
