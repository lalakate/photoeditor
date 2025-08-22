import { ActiveFilters } from '@/features';

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
