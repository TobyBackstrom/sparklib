// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import { Route, Routes, Link } from 'react-router-dom';
import * as sparklib from 'react-sparklib';

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

const hGradient = sparklib
  .linearGradient(0, 0, 250, 0)
  .addColorStop(0, 'lightgreen')
  .addColorStop(1, 'black');

export function App() {
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
      <br></br>
      <sparklib.StripeChart
        values={data2}
        width={150}
        gradientColors={gradientColors}
        nGradientColorLevels={2}
      />
    </div>
  );
}

export default App;
