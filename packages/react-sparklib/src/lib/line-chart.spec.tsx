import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import LineChart from './line-chart';

interface TestObject {
  x: number;
  y: number;
}

afterEach(() => {
  cleanup();
});

describe('LineChart', () => {
  test('should render successfully', () => {
    const { baseElement } = render(
      <LineChart
        values={[
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
        ]}
      />,
    );
    expect(baseElement).toBeInTheDocument();
  });

  test('should render successfully', () => {
    const { baseElement } = render(
      <LineChart
        values={[
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
        ]}
      />,
    );
    expect(baseElement).toBeInTheDocument();
  });
});
