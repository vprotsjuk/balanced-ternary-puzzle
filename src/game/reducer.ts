import { computeCurrentSum, cycleCellState, parseManualTarget } from './board';
import { BOARD_MAX_BY_SIZE, cycleBoardSize } from './config';
import { resetRound, type GameState } from './state';
import type { BoardSize } from './types';

function requireValidTargetForBoard(boardSize: BoardSize, target: unknown): number {
  const max = BOARD_MAX_BY_SIZE[boardSize];
  if (
    typeof target !== 'number' ||
    !Number.isFinite(target) ||
    !Number.isInteger(target) ||
    target < 1 ||
    target > max
  ) {
    throw new Error(`Invalid target for board ${boardSize}: ${target}`);
  }
  return target;
}

export type GameAction =
  | { type: 'board/selected'; boardSize: BoardSize; nextTarget?: number }
  | {
      type: 'mode/toggled';
      enabled: boolean;
      nextTargets?: Record<BoardSize, number>;
    }
  | { type: 'draft/changed'; value: string }
  | { type: 'target/submitted'; raw: string }
  | { type: 'cell/tapped'; index: number }
  | { type: 'round/finished'; nextTarget?: number };

function advanceSequentialRound(state: GameState): GameState {
  const maxForBoard = BOARD_MAX_BY_SIZE[state.boardSize];
  if (state.target < maxForBoard) {
    return resetRound(state.boardSize, 'sequential', state.target + 1);
  }

  return resetRound(cycleBoardSize(state.boardSize), 'sequential', 1);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'round/finished' && state.status !== 'celebrating') {
    return state;
  }

  if (state.status === 'celebrating' && action.type !== 'round/finished') {
    return state;
  }

  switch (action.type) {
    case 'board/selected': {
      if (state.playMode === 'random') {
        if (typeof action.nextTarget !== 'number') {
          throw new Error('Missing nextTarget for random board selection');
        }

        return resetRound(action.boardSize, 'random', requireValidTargetForBoard(action.boardSize, action.nextTarget));
      }

      return resetRound(action.boardSize, 'sequential', 1);
    }
    case 'mode/toggled': {
      if (!action.enabled) {
        return { ...state, playMode: 'sequential' };
      }

      if (!action.nextTargets) {
        throw new Error('Missing nextTargets for random mode toggle');
      }

      return resetRound(
        state.boardSize,
        'random',
        requireValidTargetForBoard(state.boardSize, action.nextTargets[state.boardSize]),
      );
    }
    case 'draft/changed':
      return { ...state, draftTarget: action.value };
    case 'target/submitted': {
      const parsed = parseManualTarget(action.raw, state.boardSize);
      if (parsed === null) return state;

      return resetRound(state.boardSize, 'sequential', parsed);
    }
    case 'cell/tapped': {
      const nextCells = state.cells.map((cell, index) =>
        index === action.index ? { ...cell, state: cycleCellState(cell.state) } : cell,
      );
      const nextState = { ...state, cells: nextCells };

      if (computeCurrentSum(nextCells) === state.target) {
        return { ...nextState, status: 'celebrating' };
      }

      return nextState;
    }
    case 'round/finished': {
      if (state.playMode === 'random') {
        if (typeof action.nextTarget !== 'number') {
          throw new Error('Missing nextTarget for random round completion');
        }

        return resetRound(
          state.boardSize,
          'random',
          requireValidTargetForBoard(state.boardSize, action.nextTarget),
        );
      }

      return advanceSequentialRound(state);
    }
  }
}
