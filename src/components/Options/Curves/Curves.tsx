import { useCurves } from '@/shared/hooks/useCurves';
import './curves.css';

export const Curves = () => {
  const {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
    handleReset,
  } = useCurves();

  return (
    <div className="curve-editor">
      <canvas
        className="curve-canvas"
        data-testid="curve-canvas"
        ref={canvasRef}
        width={256}
        height={256}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />
      <div className="curve-controls">
        <button className="reset-curve-button" onClick={handleReset}>
          Reset Curve
        </button>
      </div>
    </div>
  );
};
