import { RootState } from '@/app/store';

export const selectIsAuthorized = (state: RootState) => state.auth.isAuthorized;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;
export const selectIsRegistering = (state: RootState) =>
  state.auth.isRegistering;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthState = (state: RootState) => state.auth;
