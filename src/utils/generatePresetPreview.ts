import { logEvent } from 'firebase/analytics';
import { ActiveFilters } from '../store/slices/editorSlice';
import { applyAllFilters } from './filters';
import { createImageUrl } from './imageUtils';
import { analytics } from '../firebase/firebaseConfig';

const DEFAULT_PREVIEW_IMAGE_URL = '/default-image.jpg';

const loadImageData = (url: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);

      logEvent(analytics, 'load_image_data', {
        url: img.src,
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = reject;
    img.src = url;
  });
};

const scaleImageData = (
  imageData: ImageData,
  maxWidth: number = 400,
  maxHeight: number = 300
): ImageData => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    logEvent(analytics, 'scale_image_data_error', {
      message: 'Could not get canvas context',
    });
    throw new Error('Could not get canvas context');
  }

  let width = imageData.width;
  let height = imageData.height;

  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }

  canvas.width = width;
  canvas.height = height;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempContext = tempCanvas.getContext('2d');
  if (!tempContext) {
    logEvent(analytics, 'scale_image_data_error', {
      message: 'Could not get temporary canvas context',
    });
    throw new Error('Could not get temp canvas context');
  }

  tempContext.putImageData(imageData, 0, 0);

  context.drawImage(
    tempCanvas,
    0,
    0,
    imageData.width,
    imageData.height,
    0,
    0,
    width,
    height
  );

  logEvent(analytics, 'scale_image_data', {
    originalWidth: imageData.width,
    originalHeight: imageData.height,
    scaledWidth: width,
    scaledHeight: height,
  });

  return context.getImageData(0, 0, width, height);
};

export const generatePresetPreview = async (
  filters: ActiveFilters
): Promise<string> => {
  try {
    const originalImageData = await loadImageData(DEFAULT_PREVIEW_IMAGE_URL);

    const scaledImageData = scaleImageData(originalImageData);

    const processedImageData = await applyAllFilters(scaledImageData, filters);

    logEvent(analytics, 'generate_preset_preview', {
      filters: JSON.stringify(filters),
      originalWidth: originalImageData.width,
      originalHeight: originalImageData.height,
      processedWidth: processedImageData.width,
      processedHeight: processedImageData.height,
    });

    return createImageUrl(processedImageData);
  } catch (error) {
    logEvent(analytics, 'generate_preset_preview_error', {
      message: (error as Error).message,
    });

    return DEFAULT_PREVIEW_IMAGE_URL;
  }
};
