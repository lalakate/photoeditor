import { analytics } from '@/app/firebase/firebaseConfig';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { GoogleButton } from '@/components/UI/GoogleButton';
import {
  loginSchema,
  registerSchema,
  selectError,
  selectIsAuthorized,
  selectIsLoading,
  selectIsRegistering,
  setRegistering,
  useAuth,
} from '@/features';
import { yupResolver } from '@hookform/resolvers/yup';
import { logEvent } from 'firebase/analytics';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './auth-form.css';

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
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const isRegistering = useAppSelector(selectIsRegistering);
  const dispatch = useAppDispatch();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

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
    dispatch(setRegistering(false));
  }, [dispatch]);

  useEffect(() => {
    if (isAuthorized) {
      navigate('/');
    }
  }, [isAuthorized, navigate]);

  useEffect(() => {
    if (error || submitError) {
      setShowPopup(true);
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, submitError]);

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

  const emailInputProps = isRegistering
    ? registerSignup('email')
    : register('email');
  const emailError = isRegistering ? signupErrors.email : errors.email;
  const emailValue = isRegistering
    ? watchedSignupFields.email
    : watchedLoginFields.email;
  const emailClass = emailError ? 'error' : emailValue ? 'valid' : '';

  const passwordInputProps = isRegistering
    ? registerSignup('password')
    : register('password');
  const passwordError = isRegistering ? signupErrors.password : errors.password;
  const passwordValue = isRegistering
    ? watchedSignupFields.password
    : watchedLoginFields.password;
  const passwordClass = passwordError ? 'error' : passwordValue ? 'valid' : '';

  let submitButtonText = '';
  if (isRegistering) {
    submitButtonText = isLoading ? 'Signing Up...' : 'Sign Up';
  } else {
    submitButtonText = isLoading ? 'Logging In...' : 'Log In';
  }

  return (
    <div className="auth-form-container">
      {isRegistering ? (
        <h2 className="form-title">Sign Up</h2>
      ) : (
        <h2 className="form-title">Log In</h2>
      )}

      <GoogleButton handleGoogleLogin={handleGoogleLogin} isLoading={false} />

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
            {...emailInputProps}
            className={emailClass}
          />
          {emailError && (
            <span className="field-error">{emailError.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...passwordInputProps}
            className={passwordClass}
          />
          <span className="field-error">
            {passwordError ? passwordError.message : ''}
          </span>
        </div>

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
          {submitButtonText}
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

      {showPopup && (error || submitError) && (
        <div className="popup-error-message">
          {error || submitError}
        </div>
      )}
    </div>
  );
};
