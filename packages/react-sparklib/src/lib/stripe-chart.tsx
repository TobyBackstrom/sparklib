import { useEffect, useRef } from 'react';
import * as sparklib from 'sparklib';

/**
 * Interface representing the properties for the StripeChart component.
 *
 * @template T - The type of the data for the chart.
 */
interface StripeChartProps<T = unknown> {
  /** Array of values to be rendered in the chart. */
  values: sparklib.StripeValueType<T>[];

  /** Optional accessor function to extract values. */
  valueAccessor?: sparklib.ValueAccessor<T>;

  /** Optional width of the chart. */
  width?: number;

  /** Optional height of the chart. */
  height?: number;

  /** Optional DPI for the chart rendering. */
  dpi?: number;

  /** Optional background styling for the chart. */
  background?:
    | string
    | sparklib.LinearGradient
    | sparklib.LinearGradientBuilder
    | undefined;

  /** Optional margins for the chart. */
  margins?: sparklib.Margins | sparklib.MarginsBuilder;

  /** Optional gradient colors for the chart. */
  gradientColors?: string[];

  /** Optional number of gradient color levels. */
  nGradientColorLevels?: number;

  /** Optional domain range for the chart. */
  domain?: sparklib.Range | undefined;

  /** Optional properties for the stripe chart. */
  properties?: sparklib.StripeChartProperties;

  /** Optional array of mouse event types to listen for. */
  mouseEventTypes?: sparklib.MouseEventType[];

  /** Optional callback for mouse events. */
  onMouseEvent?: (event: sparklib.ChartMouseEvent) => void;
}

/**
 * StripeChart component renders a canvas-based chart using the sparklib library.
 *
 * This component sets up a StripeChart instance and attaches necessary event listeners.
 * It cleans up by disposing of the StripeChart instance when the component unmounts or when
 * certain props change, to prevent memory leaks.
 *
 * @template T - The type of the data for the chart.
 * @param props - The properties of the StripeChart component.
 * @returns A canvas element configured to display the stripe chart.
 */
// prettier-ignore
export const StripeChart = <T = unknown>(props: StripeChartProps<T>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stripeChart = sparklib.stripeChart<T>(props.properties);

    const handleMouseEvent = (event: sparklib.ChartMouseEvent) => {
      props.onMouseEvent?.(event);
    };

    const setupMouseListener = (stripeChart: sparklib.StripeChart<T>) => {
      if (
        canvasRef.current &&
        props.mouseEventTypes &&
        props.mouseEventTypes.length > 0
      ) {
        stripeChart.mouseEventListener(props.mouseEventTypes, handleMouseEvent);
      }
    };

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

    if (canvasRef.current) {
      setChartProperties(stripeChart);
      setupMouseListener(stripeChart);
      stripeChart.render(props.values, canvasRef.current);
    }

    return () => {
      stripeChart.dispose();
    };
  }, [props]);

  return <canvas ref={canvasRef}></canvas>;
};
