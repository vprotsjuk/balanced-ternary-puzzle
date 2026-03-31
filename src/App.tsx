import { useState } from 'react';
import { GameView } from './components/GameView';
import { createInitialState } from './createInitialState';

export default function App() {
  const [initialState] = useState(createInitialState);
  return <GameView initialState={initialState} layout="desktop" />;
}
