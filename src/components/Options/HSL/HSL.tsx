import { useHsl } from '@/shared/hooks/useHsl';
import { hslPresets } from '@/shared/constants';
import { RangeSlider } from '../RangeSlider';
import './hsl.css';

export const HSL = () => {
  const {
    handleHueChange,
    handleSaturationChange,
    handleLightnessChange,
    getModifiedColor,
    handleReset,
    hue,
    saturation,
    lightness,
  } = useHsl();

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
