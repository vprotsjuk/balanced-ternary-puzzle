import { render, screen } from '@testing-library/react';
import { AdaptiveNumber } from '../AdaptiveNumber';
import { chooseBestTwoLineSplit } from '../numberLayout';

it('returns null when the value already fits on one line', () => {
  expect(chooseBestTwoLineSplit(729, (part) => part.length * 10, 40)).toBeNull();
});

it('chooses the most balanced two-line split when a single line does not fit', () => {
  expect(chooseBestTwoLineSplit(59049, (part) => part.length * 10, 30)).toEqual([
    '59',
    '049',
  ]);
});

it('keeps banner numbers on a single line even in a narrow width', () => {
  render(
    <AdaptiveNumber
      value={59049}
      mode="banner"
      maxWidth={20}
      measure={(part) => part.length * 10}
    />,
  );

  expect(screen.getByText('59049')).toBeInTheDocument();
  expect(screen.queryByTestId('adaptive-number-line-break')).not.toBeInTheDocument();
});

it('splits cell numbers across two lines when needed for fit', () => {
  render(
    <AdaptiveNumber
      value={59049}
      mode="cell"
      maxWidth={30}
      measure={(part) => part.length * 10}
    />,
  );

  expect(screen.getByText('59')).toBeInTheDocument();
  expect(screen.getByText('049')).toBeInTheDocument();
  expect(screen.getByTestId('adaptive-number-line-break')).toBeInTheDocument();
});
