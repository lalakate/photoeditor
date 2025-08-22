import { ActiveFilters } from '@/features';

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
