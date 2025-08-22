import React from 'react';
import './preset-card.css';
import { CloudPreset } from '@/features';

interface PresetCardProps {
  preset: CloudPreset;
}

export const PresetCard: React.FC<PresetCardProps> = ({ preset }) => {
  return (
    <div className="preset-card">
      <div className="preset-image-container">
        <img
          src={preset.previewUrl}
          alt={preset.name}
          className="preset-image"
        />
      </div>
      <h3 className="preset-name">{preset.name}</h3>
    </div>
  );
};
