import { createNeutralCells, randomTarget } from './board';
import type { BoardSize, Cell } from './types';

export type PlayMode = 'random' | 'sequential';
export type GameStatus = 'playing' | 'celebrating';

export interface GameState {
  boardSize: BoardSize;
  playMode: PlayMode;
  target: number;
  draftTarget: string;
  cells: Cell[];
  status: GameStatus;
}

export function createGameState(overrides: Partial<GameState> = {}): GameState {
  const boardSize = overrides.boardSize ?? 2;
  const playMode = overrides.playMode ?? 'random';
  const target = overrides.target ?? (playMode === 'sequential' ? 1 : randomTarget(boardSize));

  return {
    draftTarget: '',
    cells: createNeutralCells(boardSize),
    status: 'playing',
    ...overrides,
    boardSize,
    playMode,
    target,
  };
}

export function resetRound(
  boardSize: BoardSize,
  playMode: PlayMode,
  target: number,
): GameState {
  return {
    boardSize,
    playMode,
    target,
    draftTarget: '',
    cells: createNeutralCells(boardSize),
    status: 'playing',
  };
}
