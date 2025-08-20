import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setRegistering } from '../../store/slices/authSlice';
import { loginSchema, registerSchema } from '../../utils/validation';
import './auth-form.css';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase/firebaseConfig';

type LoginData = {
  email: string;
  password: string;
};

type SignupData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const AuthForm = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, register: registerUser } = useAuth();
  const { isLoading, error, isAuthorized, isRegistering } = useAppSelector(
    state => state.auth
  );
  const dispatch = useAppDispatch();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<LoginData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors, isValid: isSignupValid },
    reset: resetSignup,
    watch: watchSignup,
  } = useForm<SignupData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const watchedLoginFields = watch();
  const watchedSignupFields = watchSignup();

  useEffect(() => {
    if (isAuthorized) {
      navigate('/');
    }
  }, [isAuthorized, navigate]);

  const handleLogin = async (data: LoginData) => {
    if (!isValid) return;

    setSubmitError(null);
    const result = await login(data.email, data.password);

    logEvent(analytics, 'user_login', { email: data.email });

    if (!result.success) {
      setSubmitError(result.error || 'Auth error');
      logEvent(analytics, 'login_error', { message: result.error });
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitError(null);
    const result = await loginWithGoogle();
  };

  const handleRegister = async (data: SignupData) => {
    if (!isSignupValid) return;

    setSubmitError(null);
    const result = await registerUser(data.email, data.password);

    logEvent(analytics, 'user_regiter', { email: data.email });

    if (!result.success) {
      setSubmitError(result.error || 'Register error');
      logEvent(analytics, 'register_error', { message: result.error });
    }
  };

  const handleSwitchMode = () => {
    dispatch(setRegistering(!isRegistering));
    reset();
    resetSignup();
    setSubmitError(null);

    logEvent(analytics, 'switch_auth_mode');
  };

  return (
    <div className="auth-form-container">
      {isRegistering ? (
        <h2 className="form-title">Sign Up</h2>
      ) : (
        <h2 className="form-title">Log In</h2>
      )}

      {(error || submitError) && (
        <div className="error-message">{error || submitError}</div>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="google-button"
      >
        <svg className="google-icon" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isLoading ? '...' : 'Authorize with Google'}
      </button>

      <div className="divider" />

      <form
        className="auth-form"
        onSubmit={
          isRegistering
            ? handleSubmitSignup(handleRegister)
            : handleSubmit(handleLogin)
        }
      >
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...(isRegistering ? registerSignup('email') : register('email'))}
            className={
              isRegistering
                ? signupErrors.email
                  ? 'error'
                  : watchedSignupFields.email
                    ? 'valid'
                    : ''
                : errors.email
                  ? 'error'
                  : watchedLoginFields.email
                    ? 'valid'
                    : ''
            }
          />
          {isRegistering
            ? signupErrors.email && (
                <span className="field-error">
                  {signupErrors.email.message}
                </span>
              )
            : errors.email && (
                <span className="field-error">{errors.email.message}</span>
              )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...(isRegistering
              ? registerSignup('password')
              : register('password'))}
            className={
              isRegistering
                ? signupErrors.password
                  ? 'error'
                  : watchedSignupFields.password
                    ? 'valid'
                    : ''
                : errors.password
                  ? 'error'
                  : watchedLoginFields.password
                    ? 'valid'
                    : ''
            }
          />
          {isRegistering
            ? signupErrors.password && (
                <span className="field-error">
                  {signupErrors.password.message}
                </span>
              )
            : errors.password && (
                <span className="field-error">{errors.password.message}</span>
              )}
        </div>

        {isRegistering && watchedSignupFields.password && (
          <PasswordStrengthIndicator password={watchedSignupFields.password} />
        )}

        {isRegistering && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...registerSignup('confirmPassword')}
              className={
                signupErrors.confirmPassword
                  ? 'error'
                  : watchedSignupFields.confirmPassword
                    ? 'valid'
                    : ''
              }
            />
            {signupErrors.confirmPassword && (
              <span className="field-error">
                {signupErrors.confirmPassword.message}
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || (isRegistering ? !isSignupValid : !isValid)}
          className="submit-button"
        >
          {isRegistering
            ? isLoading
              ? 'Signing Up...'
              : 'Sign Up'
            : isLoading
              ? 'Logging In...'
              : 'Log In'}
        </button>
      </form>

      <p className="switch-form">
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={handleSwitchMode}
          className="submit-button link"
        >
          {isRegistering ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};
