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

function requireCellValue(value: Cell['value']): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 1
  ) {
    throw new Error(`Invalid cell value: ${value}`);
  }
  let power = value;
  while (power % 3 === 0) {
    power /= 3;
  }
  if (power !== 1) {
    throw new Error(`Invalid cell value: ${value}`);
  }
  return value;
}

function requireCellEntry(cell: unknown): Cell {
  if (cell === null || typeof cell !== 'object' || Array.isArray(cell)) {
    throw new Error(`Invalid cell entry: ${cell}`);
  }
  return cell as Cell;
}

export function computeCurrentSum(cells: Cell[]): number {
  return cells.reduce((sum, cell) => {
    const entry = requireCellEntry(cell);
    const value = requireCellValue(entry.value);
    if (entry.state === 'plus') return sum + value;
    if (entry.state === 'minus') return sum - value;
    if (entry.state === 'neutral') return sum;
    throw new Error(`Invalid cell state: ${entry.state}`);
  }, 0);
}

export function parseManualTarget(raw: string, size: BoardSize): number | null {
  const max = BOARD_MAX_BY_SIZE[requireBoardSize(size)];
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!/^[0-9]+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < 1) return null;
  return value <= max ? value : null;
}

export function clampDraftTarget(raw: string, size: BoardSize): string {
  const max = BOARD_MAX_BY_SIZE[requireBoardSize(size)];
  const trimmed = raw.trim();
  if (!/^[0-9]+$/.test(trimmed)) return raw;

  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < 1) return raw;

  return value > max ? String(max) : raw;
}

export function randomTarget(size: BoardSize, rng: () => number = Math.random): number {
  const max = BOARD_MAX_BY_SIZE[requireBoardSize(size)];
  const sample = rng();
  if (typeof sample !== 'number' || !Number.isFinite(sample)) {
    throw new Error(`Invalid random target sample: ${sample}`);
  }
  if (sample < 0 || sample > 1) {
    throw new Error(`Invalid random target sample: ${sample}`);
  }
  if (sample === 1) return max;
  return Math.floor(sample * max) + 1;
}

export { cycleBoardSize, getBoardRangeLabel };
