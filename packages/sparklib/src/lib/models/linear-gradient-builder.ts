import { ColorStop } from './color-stop';
import { LinearGradient } from './linear-gradient';

export class LinearGradientBuilder {
  private colorStops: ColorStop[];

  constructor(
    private x0: number,
    private y0: number,
    private x1: number,
    private y1: number,
    colorStops?: ColorStop[]
  ) {
    this.colorStops = colorStops ?? [];
  }

  addColorStop(offset: number, color: string): LinearGradientBuilder {
    this.colorStops.push({ offset, color });
    return this;
  }

  build(): LinearGradient {
    return {
      x0: this.x0,
      y0: this.y0,
      x1: this.x1,
      y1: this.y1,
      colorStops: this.colorStops,
    };
  }
}
