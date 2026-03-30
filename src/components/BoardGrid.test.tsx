import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createNeutralCells } from '../game/board';
import { BoardGrid } from './BoardGrid';

afterEach(() => cleanup());

it('keeps the temporary tap contract visible', () => {
  const onCellTap = vi.fn();

  render(
    <BoardGrid boardSize={2} cells={createNeutralCells(2)} blocked={false} onCellTap={onCellTap} />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Cell 1, value 1, neutral' }));

  expect(onCellTap).toHaveBeenCalledWith(0);
});
