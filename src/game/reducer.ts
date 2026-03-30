import { computeCurrentSum, cycleCellState, parseManualTarget } from './board';
import { BOARD_MAX_BY_SIZE, cycleBoardSize } from './config';
import { resetRound, type GameState } from './state';
import type { BoardSize } from './types';

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
  | { type: 'round/finished'; nextTargets?: Record<BoardSize, number> };

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

        return resetRound(action.boardSize, 'random', action.nextTarget);
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

      return resetRound(state.boardSize, 'random', action.nextTargets[state.boardSize]);
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
        if (!action.nextTargets) {
          throw new Error('Missing nextTargets for random round completion');
        }

        return resetRound(state.boardSize, 'random', action.nextTargets[state.boardSize]);
      }

      const maxForBoard = BOARD_MAX_BY_SIZE[state.boardSize];
      if (state.target < maxForBoard) {
        return resetRound(state.boardSize, 'sequential', state.target + 1);
      }

      const nextBoardSize = cycleBoardSize(state.boardSize);
      return resetRound(nextBoardSize, 'sequential', 1);
    }
  }
}
