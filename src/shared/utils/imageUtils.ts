import * as fabric from 'fabric';

export const extractImageData = (image: fabric.Image): ImageData | null => {
  if (!image) return null;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = image.width!;
  tempCanvas.height = image.height!;
  const tempContext = tempCanvas.getContext('2d');

  if (!tempContext) return null;

  const imgElement = image.getElement() as HTMLImageElement;
  tempContext.drawImage(imgElement, 0, 0);
  return tempContext.getImageData(0, 0, image.width!, image.height!);
};

export const createImageUrl = (imageData: ImageData): string => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempContext = tempCanvas.getContext('2d');

  if (tempContext) {
    tempContext.putImageData(imageData, 0, 0);
    const dataURL = tempCanvas.toDataURL();
    return dataURL;
  }

  return '';
};

export const createFabricImage = async (
  imageUrl: string,
  originalImage: fabric.Image
): Promise<fabric.Image> => {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(imageUrl, {
      crossOrigin: 'anonymous',
    })
      .then((newImg: fabric.Image) => {
        newImg.set({
          left: originalImage.left,
          top: originalImage.top,
          scaleX: originalImage.scaleX,
          scaleY: originalImage.scaleY,
          originX: 'center',
          originY: 'center',
        });

        resolve(newImg);
      })
      .catch(error => {
        console.error('createFabricImage: Error loading image:', error);
        reject(error);
      });
  });
};

export const scaleImageToCanvas = (
  img: fabric.Image,
  canvas: fabric.Canvas
): void => {
  const canvasWidth = canvas.width || 800;
  const canvasHeight = canvas.height || 600;

  const imgRatio = img.width! / img.height!;
  const canvasRatio = canvasWidth / canvasHeight;

  let scaleFactor = 1;

  if (imgRatio > canvasRatio) {
    scaleFactor = canvasWidth / img.width!;
  } else {
    scaleFactor = canvasHeight / img.height!;
  }

  img.scale(scaleFactor * 0.9);

  img.set({
    left: canvasWidth / 2,
    top: canvasHeight / 2,
    originX: 'center',
    originY: 'center',
  });
};
