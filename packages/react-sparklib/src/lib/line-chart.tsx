import React, { useEffect, useRef } from 'react';
import {
  Margins,
  DatumLine,
  LinearGradient,
  LineChart as SparkLib_LineChart,
  lineChart,
  LineChartProperties,
  Range,
  LinearGradientBuilder,
  MarginsBuilder,
} from 'sparklib';

interface LineChartProps {
  values: (number | [number, number])[];
  width?: number;
  height?: number;
  dpi?: number;
  background?: string | LinearGradient | LinearGradientBuilder;
  margins?: Partial<Margins> | MarginsBuilder;
  strokeStyle?: string | LinearGradient | LinearGradientBuilder;
  fillStyle?: string | LinearGradient | LinearGradientBuilder;
  lineDash?: number[];
  lineWidth?: number;
  xDomain?: Range;
  yDomain?: Range;
  xDatumLines?: DatumLine[];
  yDatumLines?: DatumLine[];
  properties?: LineChartProperties;
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const chart = lineChart(props.properties);

    const setChartProperties = (chart: SparkLib_LineChart) => {
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
      canvasRef.current.replaceWith(chart.render(props.values));
    }
  }, [props]);

  const getInputToChartMappings = (
    chart: SparkLib_LineChart,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, (arg: any) => SparkLib_LineChart> => {
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
