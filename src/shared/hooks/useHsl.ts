import { analytics } from '@/app/firebase/firebaseConfig';
import { useAppDispatch } from '@/app/store/hooks';
import { applyFilter } from '@/features';
import * as Sentry from '@sentry/react';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';

export const useHsl = () => {
  const dispatch = useAppDispatch();
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0);

  const handleHueChange = (value: number) => {
    setHue(value);
    dispatch(applyFilter({ type: 'hue', value }));

    logEvent(analytics, 'apply_hue', { value: value });
    Sentry.captureMessage('HSL: Hue changed', {
      level: 'info',
      extra: { value },
    });
  };

  const handleSaturationChange = (value: number) => {
    setSaturation(value);
    dispatch(applyFilter({ type: 'hslSaturation', value }));

    logEvent(analytics, 'apply_hsl_saturation', { value: value });
    Sentry.captureMessage('HSL: Saturation changed', {
      level: 'info',
      extra: { value },
    });
  };

  const handleLightnessChange = (value: number) => {
    setLightness(value);
    dispatch(applyFilter({ type: 'lightness', value }));

    logEvent(analytics, 'apply_lightness', { value: value });
    Sentry.captureMessage('HSL: Lightness changed', {
      level: 'info',
      extra: { value },
    });
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

    Sentry.captureMessage('HSL: Reset', { level: 'info' });
  };

  return {
    handleHueChange,
    handleSaturationChange,
    handleLightnessChange,
    getModifiedColor,
    handleReset,
    hue,
    saturation,
    lightness,
  };
};
