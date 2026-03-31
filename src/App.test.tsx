import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('./game/board', async () => {
  const actual = await vi.importActual<typeof import('./game/board')>('./game/board');
  return {
    ...actual,
    randomTarget: vi.fn(),
  };
});

import { randomTarget } from './game/board';
import App from './App';

afterEach(() => cleanup());

function getStatusValue(label: string) {
  return screen
    .getByText(label)
    .closest('.status-card')
    ?.querySelector('.adaptive-number--banner')?.textContent;
}

it('renders the mobile shell with board size buttons, displays, and input controls', () => {
  render(<App />);

  expect(screen.getByRole('button', { name: '2x2' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '3x3' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '4x4' })).toBeInTheDocument();
  expect(screen.getByText(/target/i)).toBeInTheDocument();
  expect(screen.getByText(/current sum/i)).toBeInTheDocument();
  expect(screen.getByLabelText('Value')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Enter' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /random/i })).toBeInTheDocument();
});

it('creates a fresh random initial state for each mount', () => {
  vi.mocked(randomTarget).mockReturnValueOnce(11).mockReturnValueOnce(22);

  const firstRender = render(<App />);
  expect(getStatusValue('Target')).toBe('11');

  firstRender.unmount();

  render(<App />);
  expect(getStatusValue('Target')).toBe('22');
});
