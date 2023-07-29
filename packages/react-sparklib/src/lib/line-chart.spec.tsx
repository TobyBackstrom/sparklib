import { render } from '@testing-library/react';
import LineChart from './line-chart';
import '@testing-library/jest-dom/extend-expect';

test('renders without crashing', () => {
  const { container } = render(
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

  expect(container).toBeInTheDocument();
});
