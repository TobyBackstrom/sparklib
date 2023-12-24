import { useEffect, useRef } from 'react';
import * as sparklib from 'sparklib';

interface LineChartProps<T = unknown> {
  values: sparklib.LineValueType<T>[];
  xAccessor?: sparklib.XYAccessorFunction<T>;
  yAccessor?: sparklib.XYAccessorFunction<T>;
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
  onMouseMove?: (event: {
    x: number;
    y: number;
    startIndex: number;
    endIndex: number;
    mouseEvent: MouseEvent;
  }) => void;
}

export const LineChart = <T = unknown,>(props: LineChartProps<T>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const valueLength = useRef(props.values.length);

  useEffect(() => {
    if (canvasRef.current) {
      const chart = sparklib.lineChart<T>(props.properties);
      const currentCanvas = canvasRef.current;

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

      setChartProperties(chart);
      chart.render(props.values, canvasRef.current);

      const handleMouseMove = (event: MouseEvent) => {
        if (!currentCanvas) {
          return;
        }

        const rect = currentCanvas.getBoundingClientRect();

        let x = Math.round(event.clientX - rect.left);
        const y = Math.round(rect.bottom - event.clientY);

        x = x < 0 ? 0 : x >= currentCanvas.width ? currentCanvas.width - 1 : x;

        const indices = sparklib.getIndicesForPixelX(
          x,
          currentCanvas.width,
          valueLength.current,
        );

        indices.endIndex =
          indices.endIndex < valueLength.current
            ? indices.endIndex
            : valueLength.current - 1;

        props.onMouseMove?.({
          x,
          y,
          startIndex: indices.startIndex,
          endIndex: indices.endIndex,
          mouseEvent: event,
        });
      };

      canvasRef.current.addEventListener('mousemove', handleMouseMove);

      // Cleanup the event listener when the component is unmounted or properties change
      return () => {
        if (currentCanvas) {
          currentCanvas.removeEventListener('mousemove', handleMouseMove);
        }
      };
    }
  }, [props]);

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

  return <canvas ref={canvasRef}></canvas>;
};

export default LineChart;
