import { analytics } from '@/app/firebase/firebaseConfig';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logEvent } from 'firebase/analytics';
import { User } from 'firebase/auth';

type AuthState = {
  user: User | null;
  isAuthorized: boolean;
  isLoading: boolean;
  error: string | null;
  isRegistering: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthorized: false,
  isLoading: true,
  error: null,
  isRegistering: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthorized = !!action.payload;
      state.isLoading = false;
      state.error = null;

      if (action.payload && action.payload.email) {
        const email = action.payload.email || 'No email';
        logEvent(analytics, 'user_login', { email });
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRegistering: (state, action: PayloadAction<boolean>) => {
      state.isRegistering = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;

      logEvent(analytics, 'auth_error', { message: action.payload });
    },
  },
});

export const { setUser, setLoading, setRegistering, setError } =
  authSlice.actions;
export default authSlice.reducer;
