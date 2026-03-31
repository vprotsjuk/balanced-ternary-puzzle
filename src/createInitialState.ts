import { randomTarget } from './game/board';
import { createGameState } from './game/state';

export function createInitialState() {
  return createGameState({
    boardSize: 2,
    playMode: 'random',
    target: randomTarget(2),
  });
}
