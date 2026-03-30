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
    selectBoardSize: (boardSize: BoardSize, nextTarget: number) =>
      dispatch({ type: 'board/selected', boardSize, nextTarget }),
    enableRandomMode: (nextTargetsByBoard: Record<BoardSize, number>) =>
      dispatch({ type: 'mode/toggled', enabled: true, nextTargets: nextTargetsByBoard }),
    disableRandomMode: () => dispatch({ type: 'mode/toggled', enabled: false }),
    changeDraftTarget: (value: string) => dispatch({ type: 'draft/changed', value }),
    submitTarget: (raw: string) => dispatch({ type: 'target/submitted', raw }),
    tapCell: (index: number) => dispatch({ type: 'cell/tapped', index }),
    finishCelebrationRandom: (nextTarget: number) => dispatch({ type: 'round/finished', nextTarget }),
    finishCelebrationSequential: () => dispatch({ type: 'round/finished' }),
  };
}
