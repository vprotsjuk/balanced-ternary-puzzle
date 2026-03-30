import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, vi } from 'vitest';
import { AdaptiveNumber } from '../AdaptiveNumber';
import { chooseBestTwoLineSplit } from '../numberLayout';

const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
const originalGetContext = HTMLCanvasElement.prototype.getContext;

beforeEach(() => {
  HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 30,
    height: 0,
    top: 0,
    left: 0,
    right: 30,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => '',
  }));

  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    font: '',
    measureText: (text: string) => ({ width: text.length * 10 }),
  })) as typeof HTMLCanvasElement.prototype.getContext;
});

afterEach(() => {
  HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  vi.unstubAllGlobals();
});

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

it('renders the cell split during the initial commit when measured width is narrow', () => {
  const observe = vi.fn();
  const disconnect = vi.fn();

  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = observe;
      disconnect = disconnect;
    },
  );

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(<AdaptiveNumber value={59049} mode="cell" />);
  });

  expect(container.textContent).toBe('59049');
  expect(container.querySelector('[data-testid="adaptive-number-line-break"]')).not.toBeNull();

  act(() => {
    root.unmount();
  });
  container.remove();
});

it('skips layout reads and observers for banner mode', () => {
  const getBoundingClientRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
  const measure = vi.fn((part: string) => part.length * 10);
  const observe = vi.fn();
  const disconnect = vi.fn();

  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = observe;
      disconnect = disconnect;
    },
  );

  render(<AdaptiveNumber value={59049} mode="banner" measure={measure} />);

  expect(getBoundingClientRect).not.toHaveBeenCalled();
  expect(observe).not.toHaveBeenCalled();
  expect(measure).not.toHaveBeenCalled();
});
