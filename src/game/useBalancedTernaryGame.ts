import { useReducer } from 'react';
import { gameReducer } from './reducer';
import { createGameState, type GameState } from './state';
import type { BoardSize } from './types';

export function useBalancedTernaryGame(initialState?: GameState) {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState,
    (state) => state ?? createGameState(),
  );

  return {
    state,
    selectBoardSize: (boardSize: BoardSize) => dispatch({ type: 'board/selected', boardSize }),
    setRandomMode: (enabled: boolean) => dispatch({ type: 'mode/toggled', enabled }),
    changeDraftTarget: (value: string) => dispatch({ type: 'draft/changed', value }),
    submitTarget: (raw: string) => dispatch({ type: 'target/submitted', raw }),
    tapCell: (index: number) => dispatch({ type: 'cell/tapped', index }),
    finishCelebration: () => dispatch({ type: 'round/finished' }),
  };
}
