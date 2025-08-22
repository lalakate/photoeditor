import { analytics } from '@/app/firebase/firebaseConfig';
import { logEvent } from 'firebase/analytics';
import { ActiveFilters } from '../edit';
import { applyWasmFilter } from '@/assets/wasm/wasmFilters';

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
