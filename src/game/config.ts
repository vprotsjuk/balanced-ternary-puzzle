import type { BoardSize } from './types';

export const BOARD_SIZES = [2, 3, 4] as const;

export const BOARD_MAX_BY_SIZE: Record<BoardSize, number> = {
  2: 40,
  3: 9841,
  4: 21523360,
};

export function requireBoardSize(size: BoardSize): BoardSize {
  if (
    typeof size !== 'number' ||
    !Number.isInteger(size) ||
    !BOARD_SIZES.includes(size as BoardSize)
  ) {
    throw new Error(`Invalid board size: ${size}`);
  }
  return size;
}

export function cycleBoardSize(size: BoardSize): BoardSize {
  const index = BOARD_SIZES.indexOf(requireBoardSize(size));
  return BOARD_SIZES[(index + 1) % BOARD_SIZES.length];
}

export function getBoardRangeLabel(size: BoardSize): string {
  return `1..${BOARD_MAX_BY_SIZE[requireBoardSize(size)]}`;
}
