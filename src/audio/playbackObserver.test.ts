import { describe, expect, it } from 'vitest';
import { createGameState } from '../game/state';
import { getCommittedCellStateNote } from './playbackObserver';

describe('committed cell note detection', () => {
  it('returns the mapped slot for a single committed cell state change', () => {
    const previous = createGameState({ boardSize: 2 });
    const next = createGameState({
      boardSize: 2,
      cells: [
        { value: 1, state: 'neutral' },
        { value: 3, state: 'plus' },
        { value: 9, state: 'neutral' },
        { value: 27, state: 'neutral' },
      ],
    });

    expect(getCommittedCellStateNote(previous, next)).toEqual({
      cellIndex: 1,
      slot: 5,
      state: 'plus',
    });
  });

  it('ignores bulk resets and board-size changes', () => {
    const previous = createGameState({
      boardSize: 2,
      cells: [
        { value: 1, state: 'plus' },
        { value: 3, state: 'minus' },
        { value: 9, state: 'neutral' },
        { value: 27, state: 'neutral' },
      ],
    });
    const reset = createGameState({ boardSize: 2 });
    const resized = createGameState({ boardSize: 3 });

    expect(getCommittedCellStateNote(previous, reset)).toBeNull();
    expect(getCommittedCellStateNote(previous, resized)).toBeNull();
  });

  it('ignores round transitions that change the target even if only one cell resets', () => {
    const previous = createGameState({
      boardSize: 2,
      target: 1,
      status: 'celebrating',
      cells: [
        { value: 1, state: 'plus' },
        { value: 3, state: 'neutral' },
        { value: 9, state: 'neutral' },
        { value: 27, state: 'neutral' },
      ],
    });
    const next = createGameState({
      boardSize: 2,
      target: 2,
    });

    expect(getCommittedCellStateNote(previous, next)).toBeNull();
  });
});
