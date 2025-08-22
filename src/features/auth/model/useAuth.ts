import { analytics, auth, googleProvider } from '@/app/firebase/firebaseConfig';
import { useAppDispatch } from '@/app/store/hooks';
import { createUserIfNotExists } from '@/shared/utils';
import * as Sentry from '@sentry/react';
import { logEvent } from 'firebase/analytics';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useEffect } from 'react';
import { getAuthErrorMessage } from './authErrorUtils';
import { setError, setLoading, setUser } from './authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      dispatch(setUser(user));
      dispatch(setLoading(false));
      if (user) {
        Sentry.captureMessage('User authenticated', {
          level: 'info',
          extra: { uid: user.uid, email: user.email },
        });
        createUserIfNotExists(user);
      } else {
        Sentry.captureMessage('User signed out', { level: 'info' });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await signInWithEmailAndPassword(auth, email, password);
      logEvent(analytics, 'user_login', { email: email });
      return { success: true };
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      logEvent(analytics, 'auth_error', { message: errorMessage });
      Sentry.captureException(error, { level: 'error', extra: { email } });
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await signInWithPopup(auth, googleProvider);
      Sentry.captureMessage('Google login successful', { level: 'info' });
      return { success: true };
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      logEvent(analytics, 'auth_error', { message: errorMessage });
      Sentry.captureException(error, {
        level: 'error',
        extra: { provider: 'google' },
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await createUserWithEmailAndPassword(auth, email, password);
      logEvent(analytics, 'user_register', { email: email });
      Sentry.captureMessage('Register successful', {
        level: 'info',
        extra: { email },
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      logEvent(analytics, 'register_error', { message: errorMessage });
      Sentry.captureException(error, { level: 'error', extra: { email } });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(setUser(null));
      logEvent(analytics, 'user_logout');
      return { success: true };
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      dispatch(setError(errorMessage));
      logEvent(analytics, 'logout_error', { message: errorMessage });
      Sentry.captureException(error, { level: 'error' });
      return { success: false, error: errorMessage };
    }
  };

  return { login, loginWithGoogle, register, logout };
};
