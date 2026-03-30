import { useReducer } from 'react';
import { randomTarget } from './board';
import { gameReducer } from './reducer';
import { createGameState, type GameState } from './state';
import type { BoardSize } from './types';

export function useBalancedTernaryGame(initialState?: GameState, rng: () => number = Math.random) {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState,
    (state) =>
      state ??
      createGameState({
        boardSize: 2,
        playMode: 'random',
        target: randomTarget(2, rng),
      }),
  );

  return {
    state,
    selectBoardSize: (boardSize: BoardSize) =>
      dispatch(
        state.playMode === 'random'
          ? { type: 'board/selected', boardSize, nextTarget: randomTarget(boardSize, rng) }
          : { type: 'board/selected', boardSize },
      ),
    setRandomMode: (enabled: boolean) =>
      dispatch(
        enabled
          ? { type: 'mode/toggled', enabled, nextTarget: randomTarget(state.boardSize, rng) }
          : { type: 'mode/toggled', enabled },
      ),
    changeDraftTarget: (value: string) => dispatch({ type: 'draft/changed', value }),
    submitTarget: (raw: string) => dispatch({ type: 'target/submitted', raw }),
    tapCell: (index: number) => dispatch({ type: 'cell/tapped', index }),
    finishCelebration: () =>
      dispatch(
        state.playMode === 'random'
          ? { type: 'round/finished', nextTarget: randomTarget(state.boardSize, rng) }
          : { type: 'round/finished' },
      ),
  };
}
