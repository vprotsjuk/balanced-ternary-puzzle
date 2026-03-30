import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BoardGrid } from '../BoardGrid';

it('renders cells in row-major order and forwards taps by index', async () => {
  const user = userEvent.setup();
  const onCellTap = vi.fn();

  render(
    <BoardGrid
      boardSize={2}
      cells={[
        { value: 1, state: 'neutral' },
        { value: 3, state: 'plus' },
        { value: 9, state: 'minus' },
        { value: 27, state: 'neutral' },
      ]}
      blocked={false}
      onCellTap={onCellTap}
    />,
  );

  expect(screen.getByRole('button', { name: 'Cell 1, neutral' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cell 3, plus' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cell 9, minus' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cell 27, neutral' })).toBeInTheDocument();
  expect(screen.getAllByRole('button')).toHaveLength(4);
  expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
    '1',
    '3',
    '9',
    '27',
  ]);

  await user.click(screen.getByRole('button', { name: 'Cell 3, plus' }));
  expect(onCellTap).toHaveBeenCalledWith(1);
});
