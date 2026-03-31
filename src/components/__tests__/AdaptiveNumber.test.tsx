import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, vi } from 'vitest';
import { AdaptiveNumber } from '../AdaptiveNumber';

const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

beforeEach(() => {
  HTMLElement.prototype.getBoundingClientRect = vi.fn(function getBoundingClientRect(
    this: HTMLElement,
  ) {
    const element = this;

    if (element.classList.contains('adaptive-number')) {
      const width = Number(element.dataset.testWidth ?? 60);
      return makeRect(width);
    }

    if (element.classList.contains('adaptive-number__line')) {
      const baseWidth = Number(element.dataset.testWidth ?? 120);
      const scale = Number(element.closest('.adaptive-number')?.getAttribute('style')?.match(/font-size:\s*([0-9.]+)em/)?.[1] ?? 1);
      return makeRect(baseWidth * scale);
    }

    return makeRect(0);
  });

  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
});

afterEach(() => {
  HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  vi.unstubAllGlobals();
});

it('keeps banner numbers on a single line with grouped spaces', () => {
  const { container } = render(<AdaptiveNumber value={59049} mode="banner" />);

  expect(container.querySelector('.adaptive-number--banner')?.textContent).toBe('59 049');
});

it('renders grouped spaces for banner numbers without introducing a line break', () => {
  const { container } = render(<AdaptiveNumber value={43046721} mode="banner" />);

  expect(
    Array.from(container.querySelectorAll('.adaptive-number__group')).map((node) => node.textContent),
  ).toEqual(['43', '046', '721']);
  expect(
    Array.from(container.querySelectorAll('.adaptive-number__separator')).map(
      (node) => node.textContent,
    ),
  ).toEqual([' ', ' ']);
  expect(screen.queryByTestId('adaptive-number-line-break')).not.toBeInTheDocument();
});

it('renders grouped spaces for cell values on one line', () => {
  const { container } = render(<AdaptiveNumber value={14348907} mode="cell" />);

  expect(
    Array.from(container.querySelectorAll('.adaptive-number__group')).map((node) => node.textContent),
  ).toEqual(['14', '348', '907']);
  expect(
    Array.from(container.querySelectorAll('.adaptive-number__separator')).map(
      (node) => node.textContent,
    ),
  ).toEqual([' ', ' ']);
  expect(screen.queryByTestId('adaptive-number-line-break')).not.toBeInTheDocument();
});

it('shrinks cell numbers to fit the available width on one line', () => {
  const { container } = render(<AdaptiveNumber value={14348907} mode="cell" />);
  const wrapper = container.querySelector('.adaptive-number--cell');
  const line = container.querySelector('.adaptive-number__line');

  if (!(wrapper instanceof HTMLElement) || !(line instanceof HTMLElement)) {
    throw new Error('Expected adaptive number elements to render');
  }

  wrapper.dataset.testWidth = '60';
  line.dataset.testWidth = '120';

  act(() => {
    window.dispatchEvent(new Event('resize'));
  });

  expect(wrapper.style.fontSize).toBe('0.5em');
  expect(line.getBoundingClientRect().width).toBe(60);
});

it('restores the base size when the cell number already fits', () => {
  const { container } = render(<AdaptiveNumber value={2187} mode="cell" />);
  const wrapper = container.querySelector('.adaptive-number--cell');
  const line = container.querySelector('.adaptive-number__line');

  if (!(wrapper instanceof HTMLElement) || !(line instanceof HTMLElement)) {
    throw new Error('Expected adaptive number elements to render');
  }

  wrapper.dataset.testWidth = '140';
  line.dataset.testWidth = '70';

  act(() => {
    window.dispatchEvent(new Event('resize'));
  });

  expect(wrapper.style.fontSize).toBe('1em');
});

it('skips resize-based fitting for banner mode', () => {
  const getBoundingClientRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
  const observe = vi.fn();
  const disconnect = vi.fn();

  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = observe;
      disconnect = disconnect;
    },
  );

  render(<AdaptiveNumber value={59049} mode="banner" />);

  expect(getBoundingClientRect).not.toHaveBeenCalled();
  expect(observe).not.toHaveBeenCalled();
  expect(disconnect).not.toHaveBeenCalled();
});

function makeRect(width: number): DOMRect {
  return {
    width,
    height: 0,
    top: 0,
    left: 0,
    right: width,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => '',
  } as DOMRect;
}
