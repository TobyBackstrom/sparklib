import { LinearGradient } from './linear-gradient';
import { LinearGradientBuilder } from './linear-gradient-builder';
import { LineProperties } from './line-properties';

export class LinePropertiesBuilder {
  private strokeStyle: string | LinearGradient | LinearGradientBuilder =
    'black';
  private lineWidth = 1;
  private lineDash: number[] = [];

  setStrokeStyle(
    strokeStyle: string | LinearGradient | LinearGradientBuilder
  ): LinePropertiesBuilder {
    this.strokeStyle = strokeStyle;
    return this;
  }

  setLineWidth(lineWidth: number): LinePropertiesBuilder {
    this.lineWidth = lineWidth;
    return this;
  }

  setLineDash(lineDash: number[]): LinePropertiesBuilder {
    this.lineDash = lineDash;
    return this;
  }

  build(): Required<LineProperties> {
    return {
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth,
      lineDash: this.lineDash,
    };
  }
}
