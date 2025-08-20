import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { applyFilter } from '../../store/slices/editorSlice';
import './curves.css';
import {
  drawCurve,
  drawGrid,
  drawPoints,
  getCurveValueAtX,
  getPointIndexAtPosition,
  Point,
} from './draws';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase/firebaseConfig';

const Curves = () => {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [points, setPoints] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, 256, 256);

    drawGrid(context);

    drawCurve(context, points);

    drawPoints(context, points, activePoint);

    const timeoutId = setTimeout(() => {
      applyCurveFilter();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [points]);

  const applyCurveFilter = () => {
    const curveArray = new Array(256).fill(0).map((_, i) => {
      return Math.round(getCurveValueAtX(i, points));
    });

    const isNeutralCurve = curveArray.every(
      (value, index) => Math.abs(value - index) < 2
    );

    if (isNeutralCurve) {
      dispatch(
        applyFilter({
          type: 'curves',
          value: null,
        })
      );
    } else {
      dispatch(
        applyFilter({
          type: 'curves',
          value: curveArray,
        })
      );
    }

    logEvent(analytics, 'apply_curves');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pointIndex = getPointIndexAtPosition(x, y, points);

    if (pointIndex !== null) {
      setActivePoint(pointIndex);
      setIsDragging(true);
    } else {
      const newPoint = { x, y };
      setPoints([...points, newPoint]);
      setActivePoint(points.length);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activePoint === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(256, e.clientX - rect.left));
    const y = Math.max(0, Math.min(256, e.clientY - rect.top));

    const newPoints = [...points];
    newPoints[activePoint] = { x, y };
    setPoints(newPoints);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pointIndex = getPointIndexAtPosition(x, y, points);

    if (pointIndex !== null && points.length > 2) {
      const newPoints = [...points];
      newPoints.splice(pointIndex, 1);
      setPoints(newPoints);
      setActivePoint(null);
    }
  };

  const handleReset = () => {
    setPoints([
      { x: 0, y: 0 },
      { x: 255, y: 255 },
    ]);
    setActivePoint(null);
  };

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

export default Curves;
