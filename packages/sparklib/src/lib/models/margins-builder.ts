import { NO_MARGINS } from '../base-chart-models';
import { Margins } from './margins';

export class MarginsBuilder {
  private margins: Margins = { ...NO_MARGINS };

  left(value: number): MarginsBuilder {
    this.margins.left = value;
    return this;
  }

  top(value: number): MarginsBuilder {
    this.margins.top = value;
    return this;
  }

  right(value: number): MarginsBuilder {
    this.margins.right = value;
    return this;
  }

  bottom(value: number): MarginsBuilder {
    this.margins.bottom = value;
    return this;
  }

  build(): Margins {
    return {
      ...this.margins,
    };
  }
}
