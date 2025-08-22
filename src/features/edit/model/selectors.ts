import { RootState } from '@/app/store';

export const selectActiveFilters = (state: RootState) =>
  state.edit.activeFilters;
export const selectImageUrl = (state: RootState) => state.edit.imageUrl;
export const selectCloudPresets = (state: RootState) => state.edit.cloudPresets;
export const selectPresetsError = (state: RootState) => state.edit.presetsError;
export const selectCloudPresetsLoading = (state: RootState) =>
  state.edit.presetsLoading;
export const selectCloudPresetsError = (state: RootState) =>
  state.edit.presetsError;

export const selectEditState = (state: RootState) => state.edit;
