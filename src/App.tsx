import { useState } from 'react';
import { randomTarget } from './game/board';
import { createGameState } from './game/state';
import { GameView } from './components/GameView';

function createInitialState() {
  return createGameState({
    boardSize: 2,
    playMode: 'random',
    target: randomTarget(2),
  });
}

export default function App() {
  const [initialState] = useState(createInitialState);
  return <GameView initialState={initialState} />;
}
