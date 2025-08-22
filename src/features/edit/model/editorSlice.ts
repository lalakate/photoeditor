import { analytics } from '@/app/firebase/firebaseConfig';
import { CloudPreset, CreatePresetData, PresetService } from '@/features';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logEvent } from 'firebase/analytics';

type Filter =
  | 'brightness'
  | 'contrast'
  | 'saturation'
  | 'blur'
  | 'sharpen'
  | 'hue'
  | 'hslSaturation'
  | 'lightness'
  | 'curves'
  | 'reset'
  | 'resetHsl';

type TApplyFilterPayload = {
  type: Filter;
  value: any;
};

export type ActiveFilters = {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpen: number;
  hue: number;
  hslSaturation: number;
  lightness: number;
  curves: number[] | null;
};

type EditState = {
  imageUrl: string | null;
  activeFilters: ActiveFilters;
  cloudPresets: CloudPreset[];
  presetsLoading: boolean;
  presetsError: string | null;
};

const initialFilters: ActiveFilters = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  sharpen: 0,
  hue: 0,
  hslSaturation: 0,
  lightness: 0,
  curves: null,
};

const initialState: EditState = {
  imageUrl: null,
  activeFilters: initialFilters,
  cloudPresets: [],
  presetsLoading: false,
  presetsError: null,
};

export const saveCloudPreset = createAsyncThunk(
  'edit/saveCloudPreset',
  async ({
    userId,
    userName,
    userPhotoURL,
    preset,
  }: {
    userId: string;
    userName: string;
    userPhotoURL?: string;
    preset: CreatePresetData;
  }) => {
    const savedPreset = await PresetService.savePreset(
      userId,
      userName,
      preset,
      userPhotoURL
    );
    return savedPreset;
  }
);

export const loadCloudPresets = createAsyncThunk(
  'edit/loadCloudPresets',
  async (userId: string) => {
    return await PresetService.getUserPresets(userId);
  }
);

export const deleteCloudPreset = createAsyncThunk(
  'edit/deleteCloudPreset',
  async (presetId: string) => {
    await PresetService.deletePreset(presetId);
    return presetId;
  }
);

export const editSlice = createSlice({
  name: 'edit',
  initialState,
  reducers: {
    setImageUrl: (state, action: PayloadAction<string>) => {
      state.imageUrl = action.payload;
      state.activeFilters = { ...initialState.activeFilters };
    },
    applyFilter: (state, action: PayloadAction<TApplyFilterPayload>) => {
      const { type, value } = action.payload;

      switch (type) {
        case 'brightness':
          state.activeFilters.brightness = value;
          break;
        case 'contrast':
          state.activeFilters.contrast = value;
          break;
        case 'saturation':
          state.activeFilters.saturation = value;
          break;
        case 'blur':
          state.activeFilters.blur = value;
          break;
        case 'sharpen':
          state.activeFilters.sharpen = value;
          break;
        case 'hue':
          state.activeFilters.hue = value;
          break;
        case 'hslSaturation':
          state.activeFilters.hslSaturation = value;
          break;
        case 'lightness':
          state.activeFilters.lightness = value;
          break;
        case 'curves':
          state.activeFilters.curves = value;
          break;
        case 'reset':
          state.activeFilters.blur = 0;
          state.activeFilters.brightness = 0;
          state.activeFilters.contrast = 0;
          state.activeFilters.curves = null;
          state.activeFilters.hslSaturation = 0;
          state.activeFilters.hue = 0;
          state.activeFilters.lightness = 0;
          state.activeFilters.saturation = 0;
          state.activeFilters.sharpen = 0;
          break;
        case 'resetHsl':
          state.activeFilters.hue = 0;
          state.activeFilters.hslSaturation = 0;
          state.activeFilters.lightness = 0;
          break;
      }
    },
    resetFilters: state => {
      state.activeFilters = { ...initialState.activeFilters };
    },

    applyCloudPreset: (state, action: PayloadAction<CloudPreset>) => {
      state.activeFilters = action.payload.filters;
    },

    clearPresetsError: state => {
      state.presetsError = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(saveCloudPreset.pending, state => {
        state.presetsLoading = true;
        state.presetsError = null;
      })
      .addCase(saveCloudPreset.fulfilled, (state, action) => {
        state.presetsLoading = false;
        state.cloudPresets.unshift(action.payload);
        logEvent(analytics, 'prest_saved', { presetName: action.payload.name });
      })
      .addCase(saveCloudPreset.rejected, (state, action) => {
        state.presetsLoading = false;
        state.presetsError = action.error.message || 'Failed to save preset';
        logEvent(analytics, 'save_preset_error', {
          message: action.error.message,
        });
      })
      .addCase(loadCloudPresets.pending, state => {
        state.presetsLoading = true;
        state.presetsError = null;
      })
      .addCase(loadCloudPresets.fulfilled, (state, action) => {
        state.presetsLoading = false;
        state.cloudPresets = action.payload;
        logEvent(analytics, 'presets_loaded', { count: action.payload.length });
      })
      .addCase(loadCloudPresets.rejected, (state, action) => {
        state.presetsLoading = false;
        state.presetsError = action.error.message || 'Failed to load presets';
        logEvent(analytics, 'load_presets_error', {
          message: action.error.message,
        });
      })
      .addCase(deleteCloudPreset.pending, state => {
        state.presetsLoading = true;
      })
      .addCase(deleteCloudPreset.fulfilled, (state, action) => {
        state.presetsLoading = false;
        state.cloudPresets = state.cloudPresets.filter(
          (preset: CloudPreset) => preset.id !== action.payload
        );
        logEvent(analytics, 'preset_deleted', { presetId: action.payload });
      })
      .addCase(deleteCloudPreset.rejected, (state, action) => {
        state.presetsLoading = false;
        state.presetsError = action.error.message || 'Failed to delete preset';
        logEvent(analytics, 'delete_preset_error', {
          message: action.error.message,
        });
      });
  },
});

export const {
  setImageUrl,
  applyFilter,
  resetFilters,
  applyCloudPreset,
  clearPresetsError,
} = editSlice.actions;
