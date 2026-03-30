import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
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
  vi.useRealTimers();
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
  expect(screen.getByText('22', { selector: '.adaptive-number--banner' })).toBeInTheDocument();

  random.mockClear();
  fireEvent.click(screen.getByRole('button', { name: '4x4' }));

  expect(random).toHaveBeenCalledWith(4);
  expect(screen.getByText(/Board 4x4/)).toBeInTheDocument();
  expect(screen.getByText('44', { selector: '.adaptive-number--banner' })).toBeInTheDocument();
});

it('locks controls for one second and then automatically starts the next random round', () => {
  vi.useFakeTimers();
  vi.mocked(randomTarget).mockReturnValue(21);

  render(
    <GameView
      initialState={createGameState({
        boardSize: 2,
        playMode: 'random',
        target: 7,
        status: 'celebrating',
        cells: [
          { value: 1, state: 'plus' },
          { value: 3, state: 'minus' },
          { value: 9, state: 'neutral' },
          { value: 27, state: 'neutral' },
        ],
      })}
    />,
  );

  expect(screen.getByRole('button', { name: '2x2' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '3x3' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '4x4' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Enter' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Random ON' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cell 1, plus' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cell 3, minus' })).toBeDisabled();
  expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(999);
  });

  expect(screen.getByRole('button', { name: '2x2' })).toBeDisabled();
  expect(screen.getByText('7', { selector: '.adaptive-number--banner' })).toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(1);
  });

  expect(randomTarget).toHaveBeenCalledWith(2);
  expect(screen.getByText('21', { selector: '.adaptive-number--banner' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '2x2' })).not.toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cell 1, neutral' })).not.toBeDisabled();
});

it('locks a winning sequential round for one second and then advances to the next target', () => {
  vi.useFakeTimers();

  render(
    <GameView
      initialState={createGameState({
        boardSize: 2,
        playMode: 'sequential',
        target: 1,
      })}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Cell 1, neutral' }));

  expect(screen.getByRole('button', { name: '2x2' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Enter' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cell 1, plus' })).toBeDisabled();

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(screen.getByText('2', { selector: '.adaptive-number--banner' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '2x2' })).not.toBeDisabled();
  expect(screen.getByRole('button', { name: 'Cell 1, neutral' })).not.toBeDisabled();
});

it('exposes the cell state in the board accessibility surface', () => {
  render(
    <GameView
      initialState={createGameState({
        boardSize: 2,
        playMode: 'sequential',
        target: 7,
        cells: [
          { value: 1, state: 'neutral' },
          { value: 3, state: 'plus' },
          { value: 9, state: 'minus' },
          { value: 27, state: 'neutral' },
        ],
      })}
    />,
  );

  expect(screen.getByRole('button', { name: 'Cell 3, plus' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cell 9, minus' })).toBeInTheDocument();
});

it('renders the mobile layout hooks for a wide centered board and horizontal status row', () => {
  const { container } = render(
    <GameView
      initialState={createGameState({
        boardSize: 4,
        playMode: 'sequential',
        target: 40,
      })}
    />,
  );

  expect(container.querySelector('.game-layout')).toBeInTheDocument();
  expect(container.querySelector('.status-strip--compact')).toBeInTheDocument();
  expect(container.querySelector('.control-panel__top-row')).toBeInTheDocument();
  expect(container.querySelector('.board-stage')).toBeInTheDocument();
  expect(container.querySelector('.board-grid--size-4')).toBeInTheDocument();
});
