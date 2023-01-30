import * as dom from './dom';

export function sparkline(
  width: number,
  height: number,
  dpi?: number
): HTMLCanvasElement {
  const context = dom.context2d(width, height, dpi);

  context.beginPath();
  context.rect(0, 0, width, height);
  context.fillStyle = 'blue';
  context.fill();

  return context?.canvas;
}
