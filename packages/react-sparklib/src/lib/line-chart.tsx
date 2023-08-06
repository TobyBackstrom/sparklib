import { useEffect, useRef } from 'react';
import * as sparklib from 'sparklib';

interface LineChartProps {
  values: (number | [number, number])[];
  width?: number;
  height?: number;
  dpi?: number;
  background?:
    | string
    | sparklib.LinearGradient
    | sparklib.LinearGradientBuilder;
  margins?: Partial<sparklib.Margins> | sparklib.MarginsBuilder;
  strokeStyle?:
    | string
    | sparklib.LinearGradient
    | sparklib.LinearGradientBuilder;
  fillStyle?: string | sparklib.LinearGradient | sparklib.LinearGradientBuilder;
  lineDash?: number[];
  lineWidth?: number;
  xDomain?: Range;
  yDomain?: Range;
  xDatumLines?: sparklib.DatumLine[];
  yDatumLines?: sparklib.DatumLine[];
  properties?: sparklib.LineChartProperties;
}

export const LineChart = (props: LineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const chart = sparklib.lineChart(props.properties);

    const setChartProperties = (chart: sparklib.LineChart) => {
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
    chart: sparklib.LineChart,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, (arg: any) => sparklib.LineChart> => {
    return {
      width: chart.width,
      height: chart.height,
      dpi: chart.dpi,
      margins: chart.margins,
      background: chart.background,
      strokeStyle: chart.strokeStyle,
      fillStyle: chart.fillStyle,
      lineDash: chart.lineDash,
      lineWidth: chart.lineWidth,
      xDomain: chart.xDomain,
      yDomain: chart.yDomain,
      xDatumLines: chart.xDatumLines,
      yDatumLines: chart.yDatumLines,
    };
  };

  return <canvas ref={canvasRef}></canvas>;
};

export default LineChart;
