import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

vi.mock('../game/board', async () => {
  const actual = await vi.importActual<typeof import('../game/board')>('../game/board');
  return {
    ...actual,
    randomTarget: vi.fn(),
  };
});

import { randomTarget } from '../game/board';
import MobileApp from './MobileApp';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it('renders the mobile shell with random inside the board-size row and a shared top status panel', () => {
  vi.mocked(randomTarget).mockReturnValue(11);

  render(<MobileApp />);

  const boardSizeRow = screen.getByRole('group', { name: 'Board size' });
  const rowButtons = within(boardSizeRow).getAllByRole('button');

  expect(rowButtons).toHaveLength(4);
  expect(rowButtons.map((button) => button.textContent)).toEqual([
    '2x2',
    '3x3',
    '4x4',
    'Random ON',
  ]);

  const statusStrip = screen.getByLabelText('Game status');
  const statusCards = within(statusStrip).getAllByRole('article');

  expect(statusCards).toHaveLength(2);
  expect(within(statusCards[0] as HTMLElement).getByText('Target')).toBeInTheDocument();
  expect(within(statusCards[0] as HTMLElement).getByText('Current Sum')).toBeInTheDocument();
  expect(within(statusCards[1] as HTMLElement).getByText('Difference')).toBeInTheDocument();
});

it('creates a fresh random initial state for each mobile mount', () => {
  vi.mocked(randomTarget).mockReturnValueOnce(11).mockReturnValueOnce(22);

  const firstRender = render(<MobileApp />);
  expect(screen.getByText('Target').closest('.status-card')?.textContent).toContain('11');

  firstRender.unmount();

  render(<MobileApp />);
  expect(screen.getByText('Target').closest('.status-card')?.textContent).toContain('22');
});
