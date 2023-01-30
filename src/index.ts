import * as dom from './dom';

export function sparkline(): HTMLCanvasElement {
  const context = dom.context2d(250, 50);

  context.beginPath();
  context.rect(0, 0, 250, 50);
  context.fillStyle = 'blue';
  context.fill();

  return context?.canvas;
}
