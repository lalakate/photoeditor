import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from 'firebase/auth';
import { analytics, auth, googleProvider } from '../firebase/firebaseConfig';
import { setError, setLoading, setUser } from '../store/slices/authSlice';
import { getAuthErrorMessage } from '../utils/authErrorUtils';
import { logEvent } from 'firebase/analytics';
import { createUserIfNotExists } from '../utils/createUserIfNotExists';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      dispatch(setUser(user));
      dispatch(setLoading(false));
      if (user) {
        createUserIfNotExists(user);
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
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await signInWithPopup(auth, googleProvider);

      return { success: true };
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      logEvent(analytics, 'auth_error', { message: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await createUserWithEmailAndPassword(auth, email, password);

      logEvent(analytics, 'user_register', { email: email });

      return { success: true };
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      logEvent(analytics, 'register_error', { message: errorMessage });
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
      return { success: false, error: errorMessage };
    }
  };

  return { login, loginWithGoogle, register, logout };
};
