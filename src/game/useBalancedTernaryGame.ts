import { useReducer } from 'react';
import { randomTarget } from './board';
import { gameReducer } from './reducer';
import { createGameState, type GameState } from './state';
import type { BoardSize } from './types';

function createRandomTargetMap(rng: () => number): Record<BoardSize, number> {
  return {
    2: randomTarget(2, rng),
    3: randomTarget(3, rng),
    4: randomTarget(4, rng),
  };
}

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
      dispatch({ type: 'board/selected', boardSize, nextTarget: randomTarget(boardSize, rng) }),
    setRandomMode: (enabled: boolean) =>
      dispatch(
        enabled
          ? { type: 'mode/toggled', enabled, nextTargets: createRandomTargetMap(rng) }
          : { type: 'mode/toggled', enabled },
      ),
    changeDraftTarget: (value: string) => dispatch({ type: 'draft/changed', value }),
    submitTarget: (raw: string) => dispatch({ type: 'target/submitted', raw }),
    tapCell: (index: number) => dispatch({ type: 'cell/tapped', index }),
    finishCelebration: () => dispatch({ type: 'round/finished', nextTargets: createRandomTargetMap(rng) }),
  };
}
