import React from 'react';
import { CloudPreset } from '@/features';
import { PresetCard } from '../Card';
import './preset-grid.css';

interface PresetGridProps {
  presets: CloudPreset[];
}

export const PresetGrid: React.FC<PresetGridProps> = ({ presets }) => {
  return (
    <div className="preset-grid">
      {presets.map(preset => (
        <PresetCard key={preset.id} preset={preset} />
      ))}
    </div>
  );
};
