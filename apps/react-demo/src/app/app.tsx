import * as sparklib from 'react-sparklib';
import { ChartMouseEvent } from 'sparklib';

const data: [number, number][] = [
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 6],
  [7, 6],
  [8, 6],
  [9, 6],
  [10, 6],
];

const data2: number[] = [1, 50, 10, 70, 1, 0, 1, 20, 1, 0];

export interface DataObject {
  xPos: number;
  yPos: number | null;
  someOtherProp: string;
}

export interface StripeDataObject {
  value: number;
  someOtherProp: string;
}

export const pairObjectSegmentValues: DataObject[] = [
  { xPos: 0, yPos: 7.64, someOtherProp: 'data' },
  { xPos: 10, yPos: -5.42, someOtherProp: 'data' },
  { xPos: 20, yPos: 11.89, someOtherProp: 'data' },
  { xPos: 30, yPos: -1.33, someOtherProp: 'data' },
  { xPos: 40, yPos: 3.52, someOtherProp: 'data' },
  { xPos: 50, yPos: -10.7, someOtherProp: 'data' },
  { xPos: 60, yPos: 8.25, someOtherProp: 'data' },
  { xPos: 70, yPos: 14.03, someOtherProp: 'data' },
  { xPos: 80, yPos: -4.97, someOtherProp: 'data' },
  { xPos: 90, yPos: null, someOtherProp: 'empty' },
  { xPos: 100, yPos: null, someOtherProp: 'empty' },
  { xPos: 110, yPos: 12.23, someOtherProp: 'data' },
  { xPos: 120, yPos: 2.64, someOtherProp: 'data' },
  { xPos: 130, yPos: -7.89, someOtherProp: 'data' },
  { xPos: 140, yPos: 5.97, someOtherProp: 'data' },
  { xPos: 150, yPos: null, someOtherProp: 'empty' },
  { xPos: 160, yPos: 8.0, someOtherProp: 'data' },
  { xPos: 170, yPos: null, someOtherProp: 'empty' },
  { xPos: 180, yPos: 9.36, someOtherProp: 'data' },
  { xPos: 190, yPos: -2.91, someOtherProp: 'data' },
  { xPos: 200, yPos: 1.78, someOtherProp: 'data' },
  { xPos: 210, yPos: -8.32, someOtherProp: 'data' },
  { xPos: 220, yPos: 13.56, someOtherProp: 'data' },
  { xPos: 230, yPos: -6.15, someOtherProp: 'data' },
];

export const randomObjectsInRange = (
  minV: number,
  maxV: number,
  length: number,
  zeroProbability: number,
): StripeDataObject[] => {
  const result: StripeDataObject[] = [];

  for (let i = 0; i < length; ++i) {
    const randomNum = parseFloat(Math.random().toFixed(1));

    if (randomNum < zeroProbability) {
      result.push({ value: 0, someOtherProp: 'zero' });
    } else {
      result.push({
        value: randomNum * (maxV - minV) + minV,
        someOtherProp: `random-${i}`,
      });
    }
  }

  return result;
};

const prideGradient = sparklib
  .linearGradient(0, 0, 250, 0)
  .addColorStop(0.077, '#ed2224')
  .addColorStop(0.154, '#f35b22')
  .addColorStop(0.231, '#f99621')
  .addColorStop(0.308, '#f5c11e')
  .addColorStop(0.385, '#f1eb1b')
  .addColorStop(0.462, '#f1eb1b')
  .addColorStop(0.539, '#f1eb1b')
  .addColorStop(0.616, '#63c720')
  .addColorStop(0.693, '#0c9b49')
  .addColorStop(0.77, '#21878d')
  .addColorStop(0.847, '#3954a5')
  .addColorStop(0.924, '#61379b')
  .addColorStop(1, '#93288e');

const gradientColors = [
  '#ed2224',
  '#f35b22',
  '#f99621',
  '#f5c11e',
  '#f1eb1b',
  '#f1eb1b',
  '#f1eb1b',
  '#63c720',
  '#0c9b49',
  '#21878d',
  '#3954a5',
  '#61379b',
  '#93288e',
];

const redColors = [
  '#ffffff',
  '#fff5f0',
  '#fee0d2',
  '#fcbba1',
  '#fc9272',
  '#fb6a4a',
  '#ef3b2c',
  '#cb181d',
  // '#a50f15',
  // '#67000d',
];

const hGradient = sparklib
  .linearGradient(0, 0, 250, 0)
  .addColorStop(0, 'lightgreen')
  .addColorStop(1, 'black');

const randomObjectsDay2 = randomObjectsInRange(0, 5, 24 * 60, 0.8);

export function App() {
  const xAccessor = (data: DataObject): number | null => data.xPos;
  const yAccessor = (data: DataObject): number | null => data.yPos;
  const handleMouseEvent = (event: ChartMouseEvent) =>
    console.log(
      `${event.eventType} [${event.startIndex}/${event.endIndex}]: (${event.x},${event.y})`,
      event,
    );

  return (
    <div className="App">
      <sparklib.LineChart
        values={data}
        background={prideGradient}
        lineWidth={2}
        lineDash={[2, 2, 10]}
        strokeStyle={hGradient}
        yDomain={[2, 6]}
      />
      <br />
      <hr />
      <sparklib.LineChart<DataObject>
        values={pairObjectSegmentValues}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        background={'lightgray'}
        margins={{ top: 10, bottom: 10, left: 10, right: 10 }}
        strokeStyle={hGradient}
        mouseEventTypes={[
          sparklib.MouseEventType.Click,
          sparklib.MouseEventType.MouseOver,
        ]}
        onMouseEvent={handleMouseEvent}
      />
      <br />
      <hr />
      <sparklib.StripeChart
        values={data2}
        width={150}
        gradientColors={gradientColors}
        nGradientColorLevels={2}
      />
      <br />
      <hr />
      <sparklib.StripeChart<StripeDataObject>
        values={randomObjectsDay2}
        valueAccessor={(data: StripeDataObject): number => data.value}
        height={25}
        width={randomObjectsDay2.length}
        gradientColors={redColors}
        nGradientColorLevels={2}
        mouseEventTypes={[
          sparklib.MouseEventType.Click,
          sparklib.MouseEventType.MouseOver,
        ]}
        onMouseEvent={handleMouseEvent}
      />
    </div>
  );
}

export default App;
