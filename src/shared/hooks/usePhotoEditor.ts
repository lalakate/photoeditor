import { analytics } from '@/app/firebase/firebaseConfig';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { initWasmFilters } from '@/assets/wasm/wasmFilters';
import {
  resetFilters,
  saveCanvasImage,
  selectActiveFilters,
  useFilters,
} from '@/features';
import * as Sentry from '@sentry/react';
import * as fabric from 'fabric';
import { logEvent } from 'firebase/analytics';
import { useEffect, useRef, useState } from 'react';
import { extractImageData, scaleImageToCanvas } from '../utils';

export const usePhotoEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [image, setImage] = useState<fabric.Image | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const activeFilters = useAppSelector(selectActiveFilters);

  const { debouncedApplyFilters } = useFilters(
    canvas,
    image,
    originalImageData,
    activeFilters,
    setImage
  );

  const debouncedApplyFiltersRef = useRef(debouncedApplyFilters);
  debouncedApplyFiltersRef.current = debouncedApplyFilters;

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: '#1e1e1e',
        width: 800,
        height: 600,
      });

      setCanvas(fabricCanvas);

      initWasmFilters().catch(error =>
        logEvent(analytics, 'wasm_init_error', { error })
      );

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (debouncedApplyFiltersRef.current) {
      logEvent(analytics, 'apply_filters', { filters: activeFilters });
      Sentry.captureMessage('Filter applied', {
        level: 'info',
        extra: { filters: activeFilters },
      });
      debouncedApplyFiltersRef.current();
    }
  }, [activeFilters]);

  useEffect(() => {
    if (activeFilters) {
      setHasChanges(true);
    }
  }, [activeFilters]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    setHasChanges(false);

    loadImage(file);

    logEvent(analytics, 'file_upload', { file: file });
    Sentry.captureMessage('Photo uploaded', {
      level: 'info',
      extra: { fileName: file.name },
    });
  };

  const loadImage = (file: File) => {
    if (!canvas) return;

    const reader = new FileReader();
    reader.onload = event => {
      const imgUrl = event.target?.result;
      if (typeof imgUrl !== 'string') return;

      fabric.Image.fromURL(imgUrl)
        .then((img: fabric.Image) => {
          canvas.clear();

          scaleImageToCanvas(img, canvas);

          canvas.add(img);
          canvas.renderAll();

          setImage(img);

          dispatch(resetFilters());

          const imageData = extractImageData(img);
          if (imageData) {
            setOriginalImageData(imageData);
          }

          setHasChanges(false);
        })
        .catch(error => {
          logEvent(analytics, 'upload_error', { file: file });
          Sentry.captureException(error);
        });
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.match(/image.*/)) {
        loadImage(file);
        Sentry.captureMessage('Photo uploaded', {
          level: 'info',
          extra: { fileName: file.name },
        });
      }
    }
  };

  const handleOpenFile = () => {
    if (image) {
      const confirmReplace = window.confirm(
        'Are you sure to close current image? All changes will be lost.'
      );
      if (!confirmReplace) return;
    }
    fileInputRef.current?.click();
  };

  const handleSaveImage = () => {
    if (canvas && image) {
      saveCanvasImage(canvas, image);

      logEvent(analytics, 'save_image', { image: image });
      Sentry.captureMessage('Photo saved', { level: 'info' });
      setHasChanges(false);
    }
  };

  function isFiltersNeutral(filters: any) {
    return (
      filters.brightness === 0 &&
      filters.contrast === 0 &&
      filters.saturation === 0 &&
      filters.hue === 0 &&
      filters.lightness === 0 &&
      filters.sharpen === 0 &&
      filters.hslSaturation === 0 &&
      filters.blur === 0 &&
      !filters.curves &&
      true
    );
  }

  useEffect(() => {
    if (!image) {
      setHasChanges(false);
      return;
    }
    setHasChanges(!isFiltersNeutral(activeFilters));
  }, [activeFilters, image]);

  return {
    debouncedApplyFilters,
    canvasRef,
    canvas,
    image,
    fileInputRef,
    hasChanges,
    handleFileChange,
    handleDragOver,
    handleDrop,
    handleOpenFile,
    handleSaveImage,
  };
};
