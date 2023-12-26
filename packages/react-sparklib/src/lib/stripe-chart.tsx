import { useEffect, useRef } from 'react';
import * as sparklib from 'sparklib';

export interface StripeChartProps<T = unknown> {
  values: sparklib.StripeValueType<T>[];
  valueAccessor?: sparklib.ValueAccessor<T>;
  width?: number;
  height?: number;
  dpi?: number;
  background?:
    | string
    | sparklib.LinearGradient
    | sparklib.LinearGradientBuilder
    | undefined;
  margins?: sparklib.Margins | sparklib.MarginsBuilder;
  gradientColors?: string[];
  nGradientColorLevels?: number;
  domain?: sparklib.Range | undefined;
  properties?: sparklib.StripeChartProperties;
}

export const StripeChart = <T = unknown,>(props: StripeChartProps<T>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const chart = sparklib.stripeChart<T>(props.properties);

    const setChartProperties = (chart: sparklib.StripeChart<T>) => {
      const inputMappings = getInputToChartMappings(chart);

      Object.entries(inputMappings).forEach(([key, method]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (props as any)[key];
        if (value !== undefined && method) {
          method.call(chart, value);
        }
      });
    };

    if (canvasRef.current) {
      setChartProperties(chart);
      chart.render(props.values, canvasRef.current);
    }
  }, [props]);

  const getInputToChartMappings = (
    chart: sparklib.StripeChart<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, (arg: any) => sparklib.StripeChart<T>> => {
    return {
      width: chart.width,
      height: chart.height,
      dpi: chart.dpi,
      margins: chart.margins,
      background: chart.background,
      gradientColors: chart.gradientColors,
      nGradientColorLevels: chart.nGradientColorLevels,
      domain: chart.domain,
      valueAccessor: chart.valueAccessor,
    };
  };

  return <canvas ref={canvasRef}></canvas>;
};

export default StripeChart;
