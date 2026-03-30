import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createGameState } from '../game/state';

vi.mock('../game/board', async () => {
  const actual = await vi.importActual<typeof import('../game/board')>('../game/board');
  return {
    ...actual,
    randomTarget: vi.fn(),
  };
});

import { randomTarget } from '../game/board';
import { GameView } from './GameView';

afterEach(() => cleanup());

it('can exit celebrating through the explicit hook-backed continue path', () => {
  vi.mocked(randomTarget).mockReturnValue(21);

  render(
    <GameView
      initialState={createGameState({
        boardSize: 2,
        playMode: 'random',
        target: 7,
        status: 'celebrating',
      })}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

  expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '2x2' })).toBeEnabled();
  expect(screen.getByText('21', { selector: '.status-value' })).toBeInTheDocument();
});
