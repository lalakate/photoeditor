import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { applyFilter } from '../../store/slices/editorSlice';
import RangeSlider from './RangeSlider';
import './hsl.css';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase/firebaseConfig';

const HSL = () => {
  const dispatch = useAppDispatch();
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0);

  const hslPresets = [
    { h: 0, s: 100, l: 50 }, // Red
    { h: 30, s: 100, l: 50 }, // Orange
    { h: 60, s: 100, l: 50 }, // Yellow
    { h: 120, s: 100, l: 50 }, // Green
    { h: 180, s: 100, l: 50 }, // Cyan
    { h: 240, s: 100, l: 50 }, // Blue
    { h: 270, s: 100, l: 50 }, // Purple
    { h: 300, s: 100, l: 50 }, // Pink
  ];

  const handleHueChange = (value: number) => {
    setHue(value);
    dispatch(applyFilter({ type: 'hue', value }));

    logEvent(analytics, 'apply_hue', { value: value });
  };

  const handleSaturationChange = (value: number) => {
    setSaturation(value);
    dispatch(applyFilter({ type: 'hslSaturation', value }));

    logEvent(analytics, 'apply_hsl_saturation', { value: value });
  };

  const handleLightnessChange = (value: number) => {
    setLightness(value);
    dispatch(applyFilter({ type: 'lightness', value }));

    logEvent(analytics, 'apply_lightness', { value: value });
  };

  const getModifiedColor = (preset: { h: number; s: number; l: number }) => {
    const newHue = (preset.h + hue) % 360;
    const newSaturation = Math.max(0, Math.min(100, preset.s + saturation));
    const newLightness = Math.max(0, Math.min(100, preset.l + lightness));

    return `hsl(${newHue}, ${newSaturation}%, ${newLightness}%)`;
  };

  const handleReset = () => {
    setHue(0);
    setSaturation(0);
    setLightness(0);
    dispatch(applyFilter({ type: 'resetHsl', value: null }));
  };

  return (
    <div className="hsl-editor">
      <div className="hsl-preview">
        <div className="hsl-preview-title">Color Preview</div>
        <div className="hsl-preview-colors">
          <div className="hsl-preview-row">
            <div className="hsl-preview-label">Original</div>
            <div className="hsl-preview-swatches">
              {hslPresets.map((preset, index) => (
                <div
                  key={index}
                  className="hsl-preview-swatch"
                  style={{
                    backgroundColor: `hsl(${preset.h}, ${preset.s}%, ${preset.l}%)`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="hsl-preview-row">
            <div className="hsl-preview-label">Modified</div>
            <div className="hsl-preview-swatches">
              {hslPresets.map((preset, index) => (
                <div
                  key={index}
                  className="hsl-preview-swatch"
                  style={{ backgroundColor: getModifiedColor(preset) }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hsl-controls">
        <div className="control-group">
          <label>Hue Rotation</label>
          <div className="hue-slider-container">
            <div className="hue-track" />
            <RangeSlider
              min={-180}
              max={180}
              value={hue}
              onChange={handleHueChange}
            />
          </div>
        </div>

        <div className="control-group">
          <label>Saturation</label>
          <RangeSlider
            min={-100}
            max={100}
            value={saturation}
            onChange={handleSaturationChange}
          />
        </div>

        <div className="control-group">
          <label>Lightness</label>
          <RangeSlider
            min={-100}
            max={100}
            value={lightness}
            onChange={handleLightnessChange}
          />
        </div>

        <button className="reset-button" onClick={handleReset}>
          Reset HSL
        </button>
      </div>
    </div>
  );
};

export default HSL;
