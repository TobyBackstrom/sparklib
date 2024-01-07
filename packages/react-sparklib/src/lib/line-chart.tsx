import { useEffect, useRef } from 'react';
import * as sparklib from 'sparklib';

/**
 * Interface representing the properties for the LineChart component.
 *
 * @template T - The type of the data for the chart.
 */
interface LineChartProps<T = unknown> {
  values: sparklib.LineValueType<T>[];
  xAccessor?: sparklib.ValueAccessor<T>;
  yAccessor?: sparklib.ValueAccessor<T>;
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
  xDomain?: sparklib.Range;
  yDomain?: sparklib.Range;
  xDatumLines?: sparklib.DatumLine[];
  yDatumLines?: sparklib.DatumLine[];
  properties?: sparklib.LineChartProperties;

  /** Optional array of mouse event types to listen for. */
  mouseEventTypes?: sparklib.MouseEventType[];

  /** Optional callback for mouse events. */
  onMouseEvent?: (event: sparklib.ChartMouseEvent) => void;
}

/**
 * LineChart component renders a canvas-based line chart using the sparklib library.
 * This component sets up a LineChart instance and attaches necessary event listeners.
 * It also handles the cleanup by disposing of the LineChart instance to prevent memory leaks.
 *
 * @template T - The type of the data for the chart.
 * @param {LineChartProps<T>} props - The properties of the LineChart component.
 * @returns A canvas element configured to display the line chart.
 */
// prettier-ignore
export const LineChart = <T = unknown>(props: LineChartProps<T>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lineChart = sparklib.lineChart<T>(props.properties);

    const handleMouseEvent = (event: sparklib.ChartMouseEvent) => {
      props.onMouseEvent?.(event);
    };

    const setupMouseListener = (stripeChart: sparklib.LineChart<T>) => {
      if (
        canvasRef.current &&
        props.mouseEventTypes &&
        props.mouseEventTypes.length > 0
      ) {
        stripeChart.mouseEventListener(props.mouseEventTypes, handleMouseEvent);
      }
    };

    const setChartProperties = (chart: sparklib.LineChart<T>) => {
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
      chart: sparklib.LineChart<T>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Record<string, (arg: any) => sparklib.LineChart<T>> => {
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
        xAccessor: chart.xAccessor,
        yAccessor: chart.yAccessor,
      };
    };

    if (canvasRef.current) {
      setChartProperties(lineChart);
      setupMouseListener(lineChart);
      lineChart.render(props.values, canvasRef.current);
    }

    return () => {
      lineChart.dispose();
    };
  }, [props]);

  return <canvas ref={canvasRef}></canvas>;
};
