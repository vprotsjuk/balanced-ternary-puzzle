import { randomTarget } from './game/board';
import { createGameState } from './game/state';
import { GameView } from './components/GameView';

const initialState = createGameState({
  boardSize: 2,
  playMode: 'random',
  target: randomTarget(2),
});

export default function App() {
  return <GameView initialState={initialState} />;
}
