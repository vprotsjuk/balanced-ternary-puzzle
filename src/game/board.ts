import { BOARD_MAX_BY_SIZE, cycleBoardSize, getBoardRangeLabel } from './config';
import type { BoardSize, Cell, CellState } from './types';

export function buildCellValues(size: BoardSize): number[] {
  const cellCount = size * size;
  return Array.from({ length: cellCount }, (_, index) => 3 ** index);
}

export function createNeutralCells(size: BoardSize): Cell[] {
  return buildCellValues(size).map((value) => ({ value, state: 'neutral' }));
}

export function cycleCellState(state: CellState): CellState {
  if (state === 'neutral') return 'plus';
  if (state === 'plus') return 'minus';
  return 'neutral';
}

export function computeCurrentSum(cells: Cell[]): number {
  return cells.reduce((sum, cell) => {
    if (cell.state === 'plus') return sum + cell.value;
    if (cell.state === 'minus') return sum - cell.value;
    return sum;
  }, 0);
}

export function parseManualTarget(raw: string, size: BoardSize): number | null {
  const trimmed = raw.trim();
  if (!/^[0-9]+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < 1) return null;
  const max = BOARD_MAX_BY_SIZE[size];
  return value <= max ? value : null;
}

export function randomTarget(size: BoardSize, rng: () => number = Math.random): number {
  return Math.floor(rng() * BOARD_MAX_BY_SIZE[size]) + 1;
}

export { cycleBoardSize, getBoardRangeLabel };
