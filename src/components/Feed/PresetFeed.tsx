import React, { useEffect, useState } from 'react';
import { CloudPreset, PresetService } from '../../services/presetService';
import PresetCardWithSave from '../Card/PresetCardWithSave';
import './preset-feed.css';
import { Loader } from '../UI/Loader/Loader';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase/firebaseConfig';

type PresetFeedProps = {
  userId?: string;
};

const PresetFeed: React.FC<PresetFeedProps> = ({ userId }) => {
  const [presets, setPresets] = useState<CloudPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        setIsLoading(true);
        let fetchedPresets: CloudPreset[];

        if (userId) {
          fetchedPresets = await PresetService.getUserPresets(userId);
        } else {
          fetchedPresets = await PresetService.getPublicPresets();
        }

        setPresets(fetchedPresets);

        logEvent(analytics, 'fetch_presets', {
          userId: userId || 'public',
          count: fetchedPresets.length,
        });
      } catch (err) {
        setError('Failed to load presets');
        logEvent(analytics, 'fetch_presets_error', {
          userId: userId || 'public',
          message: (err as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresets();
  }, [userId]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (presets.length === 0) {
    return (
      <div className="empty">
        <p>No presets found</p>
      </div>
    );
  }

  return (
    <div className="preset-feed">
      <h2 className="explore">Explore</h2>
      {presets.map(preset => (
        <PresetCardWithSave key={preset.id} preset={preset} />
      ))}
    </div>
  );
};

export default PresetFeed;
