import { usePhotoEditor } from '@/shared/hooks';
import { Toolbar } from '@/features';
import './photo-editor.css';

export const PhotoEditor = () => {
  const {
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
  } = usePhotoEditor();

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
            disabled={!image || !hasChanges}
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
          onClick={() => fileInputRef.current?.click()}
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
