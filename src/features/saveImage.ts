import * as fabric from 'fabric';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../app/firebase/firebaseConfig';

export const saveCanvasImage = async (
  canvas: fabric.Canvas,
  image: fabric.Image
): Promise<void> => {
  if (!canvas || !image) return;

  try {
    const tempCanvas = document.createElement('canvas');

    const scaledWidth = image.width! * (image.scaleX || 1);
    const scaledHeight = image.height! * (image.scaleY || 1);

    tempCanvas.width = scaledWidth;
    tempCanvas.height = scaledHeight;
    const tempContext = tempCanvas.getContext('2d');

    if (tempContext) {
      canvas.renderAll();

      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
        left: (image.left || 0) - scaledWidth / 2,
        top: (image.top || 0) - scaledHeight / 2,
        width: scaledWidth,
        height: scaledHeight,
        multiplier: 1.0,
      });

      const checkImg = new Image();
      checkImg.onload = () => {
        if (checkImg.width > 0 && checkImg.height > 0) {
          tempContext.drawImage(checkImg, 0, 0, scaledWidth, scaledHeight);

          const finalDataURL = tempCanvas.toDataURL('image/png', 1.0);

          downloadImage(finalDataURL, 'edited_image.png');
          logEvent(analytics, 'image_saved', {
            width: scaledWidth,
            height: scaledHeight,
          });
        } else {
          fallbackSaveMethod(canvas);
        }
      };

      checkImg.onerror = () => {
        logEvent(analytics, 'image_save_error', {
          message: 'Image loading failed',
        });
        fallbackSaveMethod(canvas);
      };

      checkImg.src = dataURL;
    }
  } catch (error) {
    logEvent(analytics, 'image_save_error', {
      message: (error as Error).message,
    });
    fallbackSaveMethod(canvas);
  }
};

const fallbackSaveMethod = (canvas: fabric.Canvas): void => {
  if (!canvas) return;

  try {
    const originalBgColor = canvas.backgroundColor;
    canvas.backgroundColor = '';
    canvas.renderAll();

    const dataURL = canvas.toDataURL({
      format: 'png',
      multiplier: 1.0,
    });

    canvas.backgroundColor = originalBgColor || '';
    canvas.renderAll();

    downloadImage(dataURL, 'edited_image.png');
    logEvent(analytics, 'image_saved_fallback', {
      message: 'Fallback save method used',
    });
  } catch (error) {
    logEvent(analytics, 'image_save_fallback_error', {
      message: (error as Error).message,
    });
  }
};

const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
  }, 100);
};
