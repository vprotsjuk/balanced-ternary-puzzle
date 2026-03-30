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

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it('switches board sizes without RNG in sequential mode and only uses RNG in random mode', () => {
  const random = vi.mocked(randomTarget);
  random.mockReturnValueOnce(11).mockReturnValueOnce(22).mockReturnValueOnce(33).mockReturnValueOnce(44);

  render(
    <GameView
      initialState={createGameState({
        boardSize: 2,
        playMode: 'sequential',
        target: 7,
      })}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '3x3' }));

  expect(random).not.toHaveBeenCalled();
  expect(screen.getByText(/Board 3x3/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Random OFF' }));
  expect(screen.getByText('22', { selector: '.status-value' })).toBeInTheDocument();

  random.mockClear();
  fireEvent.click(screen.getByRole('button', { name: '4x4' }));

  expect(random).toHaveBeenCalledWith(4);
  expect(screen.getByText(/Board 4x4/)).toBeInTheDocument();
  expect(screen.getByText('44', { selector: '.status-value' })).toBeInTheDocument();
});

it('locks controls while celebrating until continue completes the round', () => {
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

  expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '2x2' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '3x3' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '4x4' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Enter' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Random ON' })).toBeDisabled();
});
