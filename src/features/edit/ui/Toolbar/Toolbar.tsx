import React, { useState } from 'react';
import * as fabric from 'fabric';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { applyFilter, resetFilters, selectActiveFilters } from '../../model';
import { RangeSlider } from '@/components/Options/RangeSlider';
import { Curves } from '@/components/Options/Curves';
import { HSL } from '@/components/Options/HSL';
import { PresetManager } from '@/components/Presets';
import './toolbar.css';

interface ToolbarProps {
  canvas: fabric.Canvas | null;
  image: fabric.Image | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({ canvas, image }) => {
  const dispatch = useAppDispatch();
  const activeFilters = useAppSelector(selectActiveFilters);
  const [activeTab, setActiveTab] = useState<string>('basic');

  const handleBrightnessChange = (value: number) => {
    dispatch(applyFilter({ type: 'brightness', value }));
  };

  const handleContrastChange = (value: number) => {
    dispatch(applyFilter({ type: 'contrast', value }));
  };

  const handleSaturationChange = (value: number) => {
    dispatch(applyFilter({ type: 'saturation', value }));
  };

  const handleBlurChange = (value: number) => {
    dispatch(applyFilter({ type: 'blur', value }));
  };

  const handleSharpenChange = (value: number) => {
    dispatch(applyFilter({ type: 'sharpen', value }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="toolbar">
      <div className="toolbar-tabs">
        <button
          className={`toolbar-tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic
        </button>
        <button
          className={`toolbar-tab ${activeTab === 'curves' ? 'active' : ''}`}
          onClick={() => setActiveTab('curves')}
        >
          Curves
        </button>
        <button
          className={`toolbar-tab ${activeTab === 'hsl' ? 'active' : ''}`}
          onClick={() => setActiveTab('hsl')}
        >
          HSL
        </button>
        <button
          className={`toolbar-tab ${activeTab === 'presets' ? 'active' : ''}`}
          onClick={() => setActiveTab('presets')}
        >
          Presets
        </button>
      </div>

      <div className="toolbar-content">
        {activeTab === 'basic' && (
          <div className="basic-controls">
            <h3>Adjustments</h3>

            <div className="control-group">
              <label>Brightness</label>
              <RangeSlider
                min={-100}
                max={100}
                value={activeFilters.brightness}
                onChange={handleBrightnessChange}
              />
            </div>

            <div className="control-group">
              <label>Contrast</label>
              <RangeSlider
                min={-100}
                max={100}
                value={activeFilters.contrast}
                onChange={handleContrastChange}
              />
            </div>

            <div className="control-group">
              <label>Saturation</label>
              <RangeSlider
                min={-100}
                max={100}
                value={activeFilters.saturation}
                onChange={handleSaturationChange}
              />
            </div>

            <div className="control-group">
              <label>Blur</label>
              <RangeSlider
                min={0}
                max={20}
                value={activeFilters.blur}
                onChange={handleBlurChange}
              />
            </div>

            <div className="control-group">
              <label>Sharpen</label>
              <RangeSlider
                min={0}
                max={100}
                value={activeFilters.sharpen}
                onChange={handleSharpenChange}
              />
            </div>

            <button className="reset-button" onClick={handleReset}>
              Reset All
            </button>
          </div>
        )}

        {activeTab === 'curves' && (
          <div className="curves-controls">
            <h3>Curve Adjustments</h3>
            <div className="curve-selector">
              <button className="curve-channel active">RGB</button>
              <button className="curve-channel">Red</button>
              <button className="curve-channel">Green</button>
              <button className="curve-channel">Blue</button>
            </div>
            <Curves />
          </div>
        )}

        {activeTab === 'hsl' && (
          <div className="hsl-controls">
            <h3>HSL Adjustments</h3>
            <HSL />
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="presets-controls">
            <PresetManager />
          </div>
        )}
      </div>
    </div>
  );
};
