interface ColorStop {
  offset: number;
  color: string;
}

export class LinearGradient {
  private colorStops: ColorStop[] = [];

  constructor(
    private x0: number,
    private y0: number,
    private x1: number,
    private y1: number
  ) {}

  addColorStop(offset: number, color: string) {
    this.colorStops.push({ offset, color });
    return this;
  }

  getCanvasGradient(context: CanvasRenderingContext2D): CanvasGradient {
    const gradient = context.createLinearGradient(
      this.x0,
      this.y0,
      this.x1,
      this.y1
    );

    this.colorStops.forEach((s) => gradient.addColorStop(s.offset, s.color));

    return gradient;
  }
}

export const linearGradient = (
  x0: number,
  y0: number,
  x1: number,
  y1: number
) => {
  return new LinearGradient(x0, y0, x1, y1);
};
