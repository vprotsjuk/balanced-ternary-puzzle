import {
  BOARD_MAX_BY_SIZE,
  cycleBoardSize,
  getBoardRangeLabel,
  requireBoardSize,
} from './config';
import type { BoardSize, Cell, CellState } from './types';

export function buildCellValues(size: BoardSize): number[] {
  const boardSize = requireBoardSize(size);
  const cellCount = boardSize * boardSize;
  return Array.from({ length: cellCount }, (_, index) => 3 ** index);
}

export function createNeutralCells(size: BoardSize): Cell[] {
  return buildCellValues(size).map((value) => ({ value, state: 'neutral' }));
}

export function cycleCellState(state: CellState): CellState {
  if (state === 'neutral') return 'plus';
  if (state === 'plus') return 'minus';
  if (state === 'minus') return 'neutral';
  throw new Error(`Invalid cell state: ${state}`);
}

export function computeCurrentSum(cells: Cell[]): number {
  return cells.reduce((sum, cell) => {
    if (cell.state === 'plus') return sum + cell.value;
    if (cell.state === 'minus') return sum - cell.value;
    if (cell.state === 'neutral') return sum;
    throw new Error(`Invalid cell state: ${cell.state}`);
  }, 0);
}

export function parseManualTarget(raw: string, size: BoardSize): number | null {
  const max = BOARD_MAX_BY_SIZE[requireBoardSize(size)];
  const trimmed = raw.trim();
  if (!/^[0-9]+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < 1) return null;
  return value <= max ? value : null;
}

export function randomTarget(size: BoardSize, rng: () => number = Math.random): number {
  const max = BOARD_MAX_BY_SIZE[requireBoardSize(size)];
  const sample = Math.min(Math.max(rng(), 0), 1);
  return Math.min(Math.floor(sample * max), max - 1) + 1;
}

export { cycleBoardSize, getBoardRangeLabel };
