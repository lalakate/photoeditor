import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  applyCloudPreset,
  clearPresetsError,
  deleteCloudPreset,
  loadCloudPresets,
  saveCloudPreset,
  selectActiveFilters,
  selectCloudPresets,
  selectCloudPresetsLoading,
  selectIsAuthorized,
  selectPresetsError,
  selectUser,
} from '@/features';
import { analytics } from '@/app/firebase/firebaseConfig';
import { logEvent } from 'firebase/analytics';
import './preset-manager.css';

export const PresetManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeFilters = useAppSelector(selectActiveFilters);
  const cloudPresets = useAppSelector(selectCloudPresets);
  const presetsLoading = useAppSelector(selectCloudPresetsLoading);
  const presetsError = useAppSelector(selectPresetsError);
  const user = useAppSelector(selectUser);
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const [presetName, setPresetName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  useEffect(() => {
    if (isAuthorized && user?.uid) {
      dispatch(loadCloudPresets(user.uid));
    }
  }, [isAuthorized, user?.uid, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearPresetsError());
    };
  }, [dispatch]);

  const handleSavePreset = async () => {
    if (!presetName.trim() || !user?.uid) return;

    try {
      await dispatch(
        saveCloudPreset({
          userId: user.uid,
          userName:
            user.displayName && user.displayName.trim()
              ? user.displayName
              : user.email
                ? user.email.split('@')[0]
                : 'Unknown User',
          userPhotoURL: user.photoURL || '',
          preset: {
            name: presetName.trim(),
            filters: activeFilters,
          },
        })
      ).unwrap();

      setPresetName('');
      setShowSaveForm(false);

      logEvent(analytics, 'save_preset');
    } catch (error) {
      logEvent(analytics, 'save_preset_error', { message: error });
    }
  };

  const handleApplyPreset = (preset: any) => {
    dispatch(applyCloudPreset(preset));

    logEvent(analytics, 'apply_preset', { preset: preset });
  };

  const handleDeletePreset = async (presetId: string) => {
    try {
      await dispatch(deleteCloudPreset(presetId)).unwrap();

      logEvent(analytics, 'delete_preset', { presetId: presetId });
    } catch (error) {
      logEvent(analytics, 'delete_preset_error', { message: error });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="preset-manager">
        <div className="auth-notice">
          <p>Log in to save and apply presets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preset-manager">
      <div className="presets-header">
        <h3>Presets</h3>
        <button
          onClick={() => setShowSaveForm(true)}
          className="add-preset-btn"
          disabled={presetsLoading}
        >
          {presetsLoading ? '...' : 'Save preset'}
        </button>
      </div>

      {presetsError && (
        <div className="error-message">
          {presetsError}
          <button onClick={() => dispatch(clearPresetsError())}>✕</button>
        </div>
      )}

      {showSaveForm && (
        <div className="add-preset-form">
          <input
            type="text"
            value={presetName}
            onChange={e => setPresetName(e.target.value)}
            placeholder="Preset name"
            className="preset-name-input"
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSavePreset();
              }
            }}
          />
          <div className="form-buttons">
            <button
              onClick={handleSavePreset}
              disabled={!presetName.trim() || presetsLoading}
              className="save-btn"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveForm(false);
                setPresetName('');
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="presets-list">
        {presetsLoading && cloudPresets.length === 0 && (
          <div className="loading">Loading presets...</div>
        )}

        {cloudPresets.length === 0 && !presetsLoading && (
          <div className="empty-state">
            <p>You have no saved presets</p>
          </div>
        )}

        {cloudPresets.map(preset => (
          <div key={preset.id} className="preset-item">
            <div className="preset-info">
              <span className="preset-name">{preset.name}</span>
            </div>
            <div className="preset-actions">
              <button
                onClick={() => handleApplyPreset(preset)}
                className="apply-btn"
              >
                Apply
              </button>
              <button
                onClick={() => handleDeletePreset(preset.id)}
                className="delete-btn"
                disabled={presetsLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
