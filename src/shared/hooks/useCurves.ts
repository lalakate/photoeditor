import { analytics } from '@/app/firebase/firebaseConfig';
import { useAppDispatch } from '@/app/store/hooks';
import {
  drawCurve,
  drawGrid,
  drawPoints,
  getCurveValueAtX,
  getPointIndexAtPosition,
  Point,
} from '@/components/Options/draws';
import { applyFilter } from '@/features';
import * as Sentry from '@sentry/react';
import { logEvent } from 'firebase/analytics';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useCurves = () => {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [points, setPoints] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ]);

  const applyCurveFilter = useCallback(() => {
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);
    const curveArray = new Array(256)
      .fill(0)
      .map((_, i) => Math.round(getCurveValueAtX(i, sortedPoints)));

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
      Sentry.captureMessage('Curves: Applied', {
        level: 'info',
        extra: { curveArray },
      });
    }

    logEvent(analytics, 'apply_curves');
  }, [points, dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyCurveFilter();
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [applyCurveFilter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, 256, 256);

    drawGrid(context);

    drawCurve(context, points);

    drawPoints(context, points, activePoint);
  }, [points, activePoint]);

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
    Sentry.captureMessage('Curves: Reset', { level: 'info' });
  };

  return {
    canvasRef,
    points,
    activePoint,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
    handleReset,
  };
};
