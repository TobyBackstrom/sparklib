import { useEffect, useRef } from 'react';
import * as sparklib from 'sparklib';

/**
 * Props for StripeChart component.
 *
 * @template T The type of the data for the chart.
 * @prop {sparklib.StripeValueType<T>[]} values - Array of values to be rendered in the chart.
 * @prop {sparklib.ValueAccessor<T>} [valueAccessor] - Optional accessor function to extract values.
 * @prop {number} [width] - Optional width of the chart.
 * @prop {number} [height] - Optional height of the chart.
 * @prop {number} [dpi] - Optional DPI for the chart rendering.
 * @prop {string | sparklib.LinearGradient | sparklib.LinearGradientBuilder} [background] - Optional background styling for the chart.
 * @prop {sparklib.Margins | sparklib.MarginsBuilder} [margins] - Optional margins for the chart.
 * @prop {string[]} [gradientColors] - Optional gradient colors for the chart.
 * @prop {number} [nGradientColorLevels] - Optional number of gradient color levels.
 * @prop {sparklib.Range} [domain] - Optional domain range for the chart.
 * @prop {sparklib.StripeChartProperties} [properties] - Optional properties for the stripe chart.
 * @prop {sparklib.MouseEventType[]} [mouseEventTypes] - Optional array of mouse event types to listen for.
 * @prop {(event: sparklib.ChartMouseEvent) => void} [onMouseEvent] - Optional callback for mouse events.
 */
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
  mouseEventTypes?: sparklib.MouseEventType[];
  onMouseEvent?: (event: sparklib.ChartMouseEvent) => void;
}

/**
 * StripeChart component renders a canvas-based chart using the sparklib library.
 *
 * This component sets up a StripeChart instance and attaches necessary event listeners.
 * It cleans up by disposing of the StripeChart instance when the component unmounts or when
 * certain props change, to prevent memory leaks.
 *
 * @template T The type of the data for the chart.
 * @param {StripeChartProps<T>} props - The properties of the StripeChart component.
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

export default StripeChart;
