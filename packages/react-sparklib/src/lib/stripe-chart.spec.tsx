import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import StripeChart from './stripe-chart';

afterEach(() => {
  cleanup();
});

describe('StripeChart', () => {
  test('should render successfully', () => {
    const { baseElement } = render(
      <StripeChart values={[1, 0, 1, 0, 1, 0, 1, 0]} />,
    );
    expect(baseElement).toBeInTheDocument();
  });
});