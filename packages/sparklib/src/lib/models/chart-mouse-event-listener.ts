import { ChartMouseEvent } from './chart-mouse-event';

/**
 * Type definition for a listener function used in chart mouse event handling.
 *
 * @param event - The native MouseEvent triggered by the user interaction on the chart.
 * @param chartMouseEvent - An optional ChartMouseEvent instance providing additional
 *                          information specific to the chart, such as the coordinates on
 *                          the chart canvas and corresponding indices in the data array.
 *                          This parameter is optional and may not be provided in all cases,
 *                          depending on the context of the event.
 *
 * @remarks
 * The ChartMouseEventListener is used to handle mouse events on a chart canvas. It provides
 * both the standard MouseEvent object and a ChartMouseEvent object with additional chart-specific
 * details.
 *
 * @example
 * ```typescript
 * const chartMouseEventListener: ChartMouseEventListener = (event, chartMouseEvent) => {
 *   if (chartMouseEvent) {
 *     console.log(`Mouse at chart coordinates: x=${chartMouseEvent.x}, y=${chartMouseEvent.y}`);
 *     console.log(`Corresponding data indices: start=${chartMouseEvent.startIndex}, end=${chartMouseEvent.endIndex}`);
 *   }
 * };
 * ```
 */
export type ChartMouseEventListener = (
  event: MouseEvent,
  chartMouseEvent?: ChartMouseEvent,
) => void;
