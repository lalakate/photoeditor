import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { editSlice, authSlice } from '@/features';

const rootReducer = combineReducers({
  edit: editSlice.reducer,
  auth: authSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const preloadedState = {
  edit: {
    ...editSlice.getInitialState(),
    presets: [],
    cloudPresets: [],
  },
  auth: {
    user: null,
    isAuthorized: false,
    isLoading: true,
    isRegistering: false,
    error: null,
  },
} as RootState;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'edit/applyFilter',
          'auth/setUser',
          'edit/saveCloudPreset/fulfilled',
          'edit/loadCloudPresets/fulfilled',
          'edit/deleteCloudPreset/fulfilled',
          'edit/updateCloudPreset/fulfilled',
        ],
        ignoredPaths: [
          'edit.activeFilters.curves',
          'auth.user',
          'edit.cloudPresets',
        ],
      },
    }),
});
