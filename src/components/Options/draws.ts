const CANVAS_SIZE = 256;
const GRID_SIZE = 32;
const POINT_RADIUS = 6;
const ACTIVE_POINT_COLOR = '#fff';
const INACTIVE_POINT_COLOR = '#d62a55';
const CURVE_COLOR = '#d62a55';
const GRID_COLOR = '#444';
const GRID_LINE_WIDTH = 0.5;
const CURVE_LINE_WIDTH = 2;
const POINT_STROKE_COLOR = '#000';
const POINT_STROKE_WIDTH = 1;
const NEUTRAL_COLOR = '#666';

export type Point = {
  x: number;
  y: number;
};

export const drawGrid = (context: CanvasRenderingContext2D) => {
  context.strokeStyle = GRID_COLOR;
  context.lineWidth = GRID_LINE_WIDTH;

  for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(CANVAS_SIZE, i);
    context.stroke();
  }

  for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, CANVAS_SIZE);
    context.stroke();
  }

  context.strokeStyle = NEUTRAL_COLOR;
  context.lineWidth = GRID_LINE_WIDTH;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(CANVAS_SIZE, CANVAS_SIZE);
  context.stroke();
};

export const drawCurve = (
  context: CanvasRenderingContext2D,
  points: Point[]
) => {
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);

  context.strokeStyle = CURVE_COLOR;
  context.lineWidth = CURVE_LINE_WIDTH;
  context.beginPath();

  if (sortedPoints.length >= CURVE_LINE_WIDTH) {
    context.moveTo(sortedPoints[0].x, sortedPoints[0].y);

    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const p1 = sortedPoints[i];
      const p2 = sortedPoints[i + 1];

      const xMid = (p1.x + p2.x) / 2;
      const yMid = (p1.y + p2.y) / 2;

      context.quadraticCurveTo(p1.x, p1.y, xMid, yMid);
    }

    context.quadraticCurveTo(
      sortedPoints[sortedPoints.length - 1].x,
      sortedPoints[sortedPoints.length - 1].y,
      sortedPoints[sortedPoints.length - 1].x,
      sortedPoints[sortedPoints.length - 1].y
    );
  }

  context.stroke();
};

export const drawPoints = (
  context: CanvasRenderingContext2D,
  points: Point[],
  activePoint: number | null
) => {
  points.forEach((point, index) => {
    context.fillStyle =
      index === activePoint ? ACTIVE_POINT_COLOR : INACTIVE_POINT_COLOR;
    context.beginPath();
    context.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = POINT_STROKE_COLOR;
    context.lineWidth = POINT_STROKE_WIDTH;
    context.beginPath();
    context.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);
    context.stroke();
  });
};

export const getCurveValueAtX = (x: number, points: Point[]): number => {
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);

  if (x <= sortedPoints[0].x) return sortedPoints[0].y;
  if (x >= sortedPoints[sortedPoints.length - 1].x)
    return sortedPoints[sortedPoints.length - 1].y;

  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const p1 = sortedPoints[i];
    const p2 = sortedPoints[i + 1];

    if (x >= p1.x && x <= p2.x) {
      const ratio = (x - p1.x) / (p2.x - p1.x);
      return p1.y + ratio * (p2.y - p1.y);
    }
  }

  return 0;
};

export const getPointIndexAtPosition = (
  x: number,
  y: number,
  points: Point[]
): number | null => {
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const distance = Math.sqrt(
      Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
    );

    if (distance <= 10) {
      return i;
    }
  }

  return null;
};
