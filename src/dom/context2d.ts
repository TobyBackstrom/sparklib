export function context2d(
  width: number,
  height: number,
  dpi?: number
): CanvasRenderingContext2D {
  if (dpi == null) {
    dpi = window.devicePixelRatio;
  }

  const canvas = document.createElement('canvas');

  canvas.width = Math.floor(width * dpi);
  canvas.height = Math.floor(height * dpi);
  canvas.style.width = width + 'px';

  const context = canvas.getContext('2d');

  if (context == null) {
    throw new Error('context2d: failed to create context');
  }

  context.scale(dpi, dpi);

  return context;
}
