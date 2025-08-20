import React, { useRef, useState, useEffect } from 'react';
import * as fabric from 'fabric';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { resetFilters } from '../../store/slices/editorSlice';
import { initWasmFilters } from '../../wasm/wasmFilters';
import { extractImageData, scaleImageToCanvas } from '../../utils/imageUtils';
import { saveCanvasImage } from '../../utils/saveImage';
import { useFilters } from '../../hooks/useFilters';
import Toolbar from '../Toolbar/Toolbar';
import './photo-editor.css';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase/firebaseConfig';

const PhotoEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [image, setImage] = useState<fabric.Image | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const activeFilters = useAppSelector(state => state.edit.activeFilters);

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
      debouncedApplyFiltersRef.current();
    }
  }, [activeFilters]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    loadImage(file);

    logEvent(analytics, 'file_upload', { file: file });
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
        })
        .catch(error => {
          logEvent(analytics, 'upload_error', { file: file });
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
      }
    }
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleSaveImage = () => {
    if (canvas && image) {
      saveCanvasImage(canvas, image);

      logEvent(analytics, 'save_image', { image: image });
    }
  };

  return (
    <div className="photo-editor">
      <div className="editor-header">
        <div className="editor-actions">
          <button onClick={handleOpenFile} className="action-button">
            Open Image
          </button>
          <button
            onClick={handleSaveImage}
            className="action-button"
            disabled={!image}
          >
            Save Image
          </button>
        </div>
      </div>

      {!image && (
        <div
          className="placeholder"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p>Drag and drop an image here or click "Open Image" to start</p>
        </div>
      )}

      <div className="editor-main">
        <div className="canvas-container">
          <canvas ref={canvasRef} />
        </div>

        {image && <Toolbar canvas={canvas} image={image} />}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default PhotoEditor;
