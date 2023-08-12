import { useEffect, useRef } from 'react';
import * as sparklib from 'sparklib';

export interface StripeChartProps {
  values: number[];
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
  numGradientColorLevels?: number; // TODO: fix usage
  domain?: Range | undefined;
  properties?: sparklib.StripeChartProperties;
}

export const StripeChart = (props: StripeChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const chart = sparklib.stripeChart(props.properties);

    const setChartProperties = (chart: sparklib.StripeChart) => {
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
    chart: sparklib.StripeChart,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, (arg: any) => sparklib.StripeChart> => {
    return {
      width: chart.width,
      height: chart.height,
      dpi: chart.dpi,
      margins: chart.margins,
      background: chart.background,
      gradientColors: chart.gradientColors,
      domain: chart.domain,
    };
  };

  return <canvas ref={canvasRef}></canvas>;
};

export default StripeChart;
