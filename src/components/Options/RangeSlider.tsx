import React, { useState } from 'react';
import './range-slider.css';

type RangeSliderProps = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  const [localValue, setLocalValue] = useState<number>(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="range-slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={localValue}
        onChange={handleChange}
        className="range-slider-input"
        step={1}
      />

      <div className="range-slider-styled">
        <div className="range-slider-track">
          <div
            className="range-slider-fill"
            style={{ width: `${getPercentage(localValue)}%` }}
          />
        </div>
        <div
          className="range-slider-thumb"
          style={{ left: `${getPercentage(localValue)}%` }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
