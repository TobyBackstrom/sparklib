import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BarChart } from '../lib/bar-chart';

afterEach(() => {
  cleanup();
});

describe('BarChart', () => {
  test('should render successfully', () => {
    const { baseElement } = render(<BarChart values={[1, 2, 3, 4, 5]} />);
    expect(baseElement).toBeInTheDocument();
  });

  // test('should render successfully', () => {
  //   const { baseElement } = render(
  //     <BarChart
  //       values={[
  //         [1, 2],
  //         [2, 3],
  //         [3, 4],
  //         [4, 5],
  //         [5, 6],
  //       ]}
  //     />,
  //   );
  //   expect(baseElement).toBeInTheDocument();
  // });
});
