import { useEffect, useRef } from 'react';
import * as sparklib from 'sparklib';

interface AxisProps {
  position?: sparklib.AxisPosition;
  width?: number;
  height?: number;
  dpi?: number;
  background?:
    | string
    | sparklib.LinearGradient
    | sparklib.LinearGradientBuilder;
  lineWidth?: number;
  font?: string; // 'bold 12px Arial'
  fontColor?: string;
  ticks?: sparklib.AxisTick[];
  tickLength?: number;
  tickWidth?: number;
  tickPadding?: number; // space between text label and tick mark
  properties?: sparklib.AxisChartProperties;
}

export const Axis = (props: AxisProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const axis = sparklib.axis(props.properties);

    const setChartProperties = (axis: sparklib.Axis) => {
      const inputMappings = getInputToChartMappings(axis);

      Object.entries(inputMappings).forEach(([key, method]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (props as any)[key];
        if (value !== undefined && method) {
          method.call(axis, value);
        }
      });
    };

    const getInputToChartMappings = (
      axis: sparklib.Axis,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Record<string, (arg: any) => sparklib.Axis> => {
      return {
        width: axis.width,
        height: axis.height,
        dpi: axis.dpi,
        background: axis.background,
        position: axis.position,
        font: axis.font,
        fontColor: axis.fontColor,
        lineWidth: axis.lineWidth,
        ticks: axis.ticks,
        tickLength: axis.tickLength,
        tickWidth: axis.tickWidth,
        tickPadding: axis.tickPadding,
      };
    };

    if (canvasRef.current) {
      setChartProperties(axis);
      axis.render(canvasRef.current);
    }
  }, [props]);

  return <canvas ref={canvasRef}></canvas>;
};
