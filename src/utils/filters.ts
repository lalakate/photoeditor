import { applyWasmFilter } from '../wasm/wasmFilters';
import { ActiveFilters } from '../store/slices/editorSlice';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/firebaseConfig';

export const hasActiveFilters = (activeFilters: ActiveFilters): boolean => {
  return Object.entries(activeFilters).some(([key, value]) => {
    if (key === 'curves') {
      return (
        Array.isArray(value) &&
        value.length === 256 &&
        !value.every((v, i) => v === i)
      );
    }
    return typeof value === 'number' && value !== 0;
  });
};

export const applyAllFilters = async (
  originalImageData: ImageData,
  activeFilters: ActiveFilters
): Promise<ImageData> => {
  logEvent(analytics, 'apply_all_filters', {
    filters: activeFilters,
  });

  let processedImageData = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );

  for (const [filterType, value] of Object.entries(activeFilters)) {
    if (value !== 0 && value !== null && value !== undefined) {
      logEvent(analytics, 'apply_filter', {
        filter: filterType,
        value: value,
      });

      if (
        filterType === 'curves' &&
        Array.isArray(value) &&
        value.length === 256
      ) {
        logEvent(analytics, 'apply_curves_filter', {
          curves: value,
        });
        processedImageData = await applyWasmFilter(
          'curves',
          processedImageData,
          value
        );
      } else if (typeof value === 'number' && value !== 0) {
        logEvent(analytics, 'apply_numeric_filter', {
          filter: filterType,
          value: value,
        });
        processedImageData = await applyWasmFilter(
          filterType,
          processedImageData,
          value
        );
      }
    }
  }
  logEvent(analytics, 'filters_applied', {
    filters: activeFilters,
  });
  return processedImageData;
};

export const areFiltersEqual = (
  filtersA: ActiveFilters,
  filtersB: ActiveFilters | null
): boolean => {
  if (!filtersB) return false;

  if (Array.isArray(filtersA.curves) && Array.isArray(filtersB.curves)) {
    if (filtersA.curves.length !== filtersB.curves.length) return false;
    for (let i = 0; i < filtersA.curves.length; i++) {
      if (filtersA.curves[i] !== filtersB.curves[i]) return false;
    }
  } else if (Boolean(filtersA.curves) !== Boolean(filtersB.curves)) {
    return false;
  }

  const numericFilters = [
    'brightness',
    'contrast',
    'saturation',
    'blur',
    'sharpen',
    'hue',
    'hslSaturation',
    'lightness',
  ] as const;
  for (const filter of numericFilters) {
    if (filtersA[filter] !== filtersB[filter]) {
      return false;
    }
  }

  return true;
};
