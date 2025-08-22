import React from 'react';
import { usePresets } from '@/shared/hooks';
import { Loader } from '@/shared/ui';
import { PresetCardWithSave } from '@/components/Card';
import './preset-feed.css';

type PresetFeedProps = {
  userId?: string;
};

export const PresetFeed: React.FC<PresetFeedProps> = ({ userId }) => {
  const { presets, isLoading, error } = usePresets(userId);

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
