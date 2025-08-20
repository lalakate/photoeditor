import React from 'react';
import PresetCard from '../Card/PresetCard';
import './preset-grid.css';
import { CloudPreset } from '../../services/presetService';

interface PresetGridProps {
  presets: CloudPreset[];
}

const PresetGrid: React.FC<PresetGridProps> = ({ presets }) => {
  return (
    <div className="preset-grid">
      {presets.map(preset => (
        <PresetCard key={preset.id} preset={preset} />
      ))}
    </div>
  );
};

export default PresetGrid;
