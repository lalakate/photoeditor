export type Point = {
  x: number;
  y: number;
};

export const drawGrid = (context: CanvasRenderingContext2D) => {
  context.strokeStyle = '#444';
  context.lineWidth = 0.5;

  for (let i = 0; i <= 256; i += 32) {
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(256, i);
    context.stroke();
  }

  for (let i = 0; i <= 256; i += 32) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, 256);
    context.stroke();
  }

  context.strokeStyle = '#666';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(256, 256);
  context.stroke();
};

export const drawCurve = (
  context: CanvasRenderingContext2D,
  points: Point[]
) => {
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);

  context.strokeStyle = '#d62a55';
  context.lineWidth = 2;
  context.beginPath();

  if (sortedPoints.length >= 2) {
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
    context.fillStyle = index === activePoint ? '#fff' : '##d62a55';
    context.beginPath();
    context.arc(point.x, point.y, 6, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = '#000';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(point.x, point.y, 6, 0, Math.PI * 2);
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
