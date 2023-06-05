import { LinearGradient } from '../models/linear-gradient';

export function createLinearGradient(
  gradient: LinearGradient,
  context: CanvasRenderingContext2D
): CanvasGradient {
  const gradientObject = context.createLinearGradient(
    gradient.x0,
    gradient.y0,
    gradient.x1,
    gradient.y1
  );

  gradient.colorStops.forEach((s) =>
    gradientObject.addColorStop(s.offset, s.color)
  );

  return gradientObject;
}
