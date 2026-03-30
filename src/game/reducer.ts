import { computeCurrentSum, cycleCellState, parseManualTarget, randomTarget } from './board';
import { BOARD_MAX_BY_SIZE, cycleBoardSize } from './config';
import { resetRound, type GameState } from './state';
import type { BoardSize } from './types';

export type GameAction =
  | { type: 'board/selected'; boardSize: BoardSize }
  | { type: 'mode/toggled'; enabled: boolean }
  | { type: 'draft/changed'; value: string }
  | { type: 'target/submitted'; raw: string }
  | { type: 'cell/tapped'; index: number }
  | { type: 'round/finished' };

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.status === 'celebrating' && action.type !== 'round/finished') {
    return state;
  }

  switch (action.type) {
    case 'board/selected': {
      const target = state.playMode === 'random' ? randomTarget(action.boardSize) : 1;
      return resetRound(action.boardSize, state.playMode, target);
    }
    case 'mode/toggled': {
      if (!action.enabled) {
        return { ...state, playMode: 'sequential' };
      }

      return resetRound(state.boardSize, 'random', randomTarget(state.boardSize));
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
        return resetRound(state.boardSize, 'random', randomTarget(state.boardSize));
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
