import { useRef, useCallback } from 'react';
import * as fabric from 'fabric';
import { ActiveFilters } from '../store/slices/editorSlice';
import {
  applyAllFilters,
  hasActiveFilters,
  areFiltersEqual,
} from '../utils/filters';
import { createImageUrl, createFabricImage } from '../utils/imageUtils';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/firebaseConfig';

export const useFilters = (
  canvas: fabric.Canvas | null,
  image: fabric.Image | null,
  originalImageData: ImageData | null,
  activeFilters: ActiveFilters,
  setImage: (img: fabric.Image) => void
) => {
  const previousFiltersRef = useRef<ActiveFilters | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const canvasRef = useRef(canvas);
  const imageRef = useRef(image);
  const originalImageDataRef = useRef(originalImageData);
  const activeFiltersRef = useRef(activeFilters);
  const setImageRef = useRef(setImage);

  canvasRef.current = canvas;
  imageRef.current = image;
  originalImageDataRef.current = originalImageData;
  activeFiltersRef.current = activeFilters;
  setImageRef.current = setImage;

  if (previousFiltersRef.current === null) {
    previousFiltersRef.current = JSON.parse(JSON.stringify(activeFilters));
  }

  const applyFiltersToImage = useCallback(async () => {
    const currentCanvas = canvasRef.current;
    const currentImage = imageRef.current;
    const currentOriginalImageData = originalImageDataRef.current;
    const currentActiveFilters = activeFiltersRef.current;
    const currentSetImage = setImageRef.current;

    if (!currentImage || !currentOriginalImageData || !currentCanvas) {
      return;
    }

    if (areFiltersEqual(currentActiveFilters, previousFiltersRef.current)) {
      return;
    }

    logEvent(analytics, 'apply_filters', {
      filters: currentActiveFilters,
    });

    try {
      if (!hasActiveFilters(currentActiveFilters)) {
        const originalImageUrl = createImageUrl(currentOriginalImageData);
        const newImg = await createFabricImage(originalImageUrl, currentImage);

        currentCanvas.remove(currentImage);
        currentCanvas.add(newImg);
        currentCanvas.renderAll();

        currentSetImage(newImg);
        previousFiltersRef.current = JSON.parse(
          JSON.stringify(currentActiveFilters)
        );
        return;
      }

      const processedImageData = await applyAllFilters(
        currentOriginalImageData,
        currentActiveFilters
      );
      const newImageUrl = createImageUrl(processedImageData);
      const newImg = await createFabricImage(newImageUrl, currentImage);

      currentCanvas.remove(currentImage);
      currentCanvas.add(newImg);
      currentCanvas.renderAll();

      currentSetImage(newImg);
      previousFiltersRef.current = JSON.parse(
        JSON.stringify(currentActiveFilters)
      );

      logEvent(analytics, 'filters_applied', {
        filters: currentActiveFilters,
      });
    } catch (error) {
      logEvent(analytics, 'apply_filters_error', {
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error applying filters',
      });
    }
  }, []);

  const debouncedApplyFilters = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      applyFiltersToImage();
    }, 100);
  }, []);

  return {
    applyFiltersToImage,
    debouncedApplyFilters,
  };
};
