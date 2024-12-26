import { useEffect, useRef } from 'react';
import * as sparklib from 'sparklib';

/**
 * Interface representing the properties for the BarChart component.
 *
 * @template T - The type of the data for the chart.
 */
interface BarChartProps<T = unknown> {
  // mandatory properties
  values: sparklib.BarValueType<T>[];

  // TODO: optional value properties
  xAccessor?: sparklib.ValueAccessor<T>;
  yAccessor?: sparklib.ValueAccessor<T>;

  // optional properties
  width?: number;
  height?: number;
  dpi?: number;
  background?:
    | string
    | sparklib.LinearGradient
    | sparklib.LinearGradientBuilder;
  barPadding?: number;
  barWidth?: number;
  margins?: Partial<sparklib.Margins> | sparklib.MarginsBuilder;
  fillStyle?: string | sparklib.LinearGradient | sparklib.LinearGradientBuilder;
  yDomain?: sparklib.Range;
  yDatumLines?: sparklib.DatumLine[];
  properties?: sparklib.BarChartProperties;
}

/**
 * BarChart component renders a canvas-based bar chart using the sparklib library.
 * This component sets up a BarChart instance and attaches necessary event listeners.
 * It also handles the cleanup by disposing of the BarChart instance to prevent memory leaks.
 *
 * @template T - The type of the data for the chart.
 * @param {BarChartProps<T>} props - The properties of the BarChart component.
 * @returns A canvas element configured to display the bar chart.
 */
// prettier-ignore
export const BarChart = <T = unknown>(props: BarChartProps<T>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const barChart = sparklib.barChart<T>(props.properties);

    const setChartProperties = (chart: sparklib.BarChart<T>) => {
      const inputMappings = getInputToChartMappings(chart);

      Object.entries(inputMappings).forEach(([key, method]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (props as any)[key];
        if (value !== undefined && method) {
          method.call(chart, value);
        }
      });
    };

    const getInputToChartMappings = (
      chart: sparklib.BarChart<T>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Record<string, (arg: any) => sparklib.BarChart<T>> => {
      return {
        width: chart.width,
        height: chart.height,
        dpi: chart.dpi,
        margins: chart.margins,
        background: chart.background,
        barPadding: chart.barPadding,
        barWidth: chart.barWidth,
        fillStyle: chart.fillStyle,
        // TODO: yDomain: chart.yDomain,
        yDatumLines: chart.yDatumLines,
        // TODO: xAccessor: chart.xAccessor,
        // TODO: yAccessor: chart.yAccessor,
      };
    };

    if (canvasRef.current) {
      setChartProperties(barChart);
      barChart.render(props.values, canvasRef.current);
    }

    return () => {
      barChart.dispose();
    };
  }, [props]);

  return <canvas ref={canvasRef}></canvas>;
};
