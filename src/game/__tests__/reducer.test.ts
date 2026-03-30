import { vi } from 'vitest';
import { computeCurrentSum } from '../board';
import { gameReducer } from '../reducer';
import { createGameState } from '../state';

describe('game reducer', () => {
  it('resets the board and clears the draft target when the board size changes', () => {
    const state = createGameState({
      boardSize: 2,
      playMode: 'sequential',
      target: 7,
      draftTarget: '88',
    });

    const next = gameReducer(state, { type: 'board/selected', boardSize: 3 });

    expect(next.boardSize).toBe(3);
    expect(next.draftTarget).toBe('');
    expect(computeCurrentSum(next.cells)).toBe(0);
  });

  it('accepts a valid manual target, turns random mode off, and resets the board', () => {
    const state = createGameState({ boardSize: 2, playMode: 'random', target: 5, draftTarget: '12' });
    const next = gameReducer(state, { type: 'target/submitted', raw: ' 12 ' });

    expect(next.target).toBe(12);
    expect(next.playMode).toBe('sequential');
    expect(next.draftTarget).toBe('');
    expect(computeCurrentSum(next.cells)).toBe(0);
  });

  it('rejects invalid manual input without changing the round', () => {
    const state = createGameState({ boardSize: 3, playMode: 'sequential', target: 9, draftTarget: '9' });
    const next = gameReducer(state, { type: 'target/submitted', raw: '1.5' });

    expect(next.target).toBe(9);
    expect(next.playMode).toBe('sequential');
    expect(next.draftTarget).toBe('9');
  });

  it('defaults sequential games to the first target instead of a random one', () => {
    const state = createGameState({ boardSize: 3, playMode: 'sequential' });

    expect(state.target).toBe(1);
  });

  it('cycles a tapped cell through neutral, plus, and minus', () => {
    const state = createGameState({ boardSize: 2, playMode: 'sequential', target: 40 });
    const plusState = gameReducer(state, { type: 'cell/tapped', index: 0 });
    const minusState = gameReducer(plusState, { type: 'cell/tapped', index: 0 });

    expect(plusState.cells[0].state).toBe('plus');
    expect(minusState.cells[0].state).toBe('minus');
  });

  it('ignores round completion while the game is still playing', () => {
    const state = createGameState({ boardSize: 2, playMode: 'sequential', target: 7 });
    const next = gameReducer(state, { type: 'round/finished' });

    expect(next).toBe(state);
  });

  it('starts a fresh random round after celebration in random mode', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createGameState({ boardSize: 2, playMode: 'random', target: 7, status: 'celebrating' });

    const next = (() => {
      try {
        return gameReducer(state, { type: 'round/finished' });
      } finally {
        randomSpy.mockRestore();
      }
    })();

    expect(next.status).toBe('playing');
    expect(next.playMode).toBe('random');
    expect(next.boardSize).toBe(2);
    expect(next.target).toBe(21);
  });

  it('advances to the next sequential target after celebration', () => {
    const state = createGameState({ boardSize: 2, playMode: 'sequential', target: 7, status: 'celebrating' });
    const next = gameReducer(state, { type: 'round/finished' });

    expect(next.status).toBe('playing');
    expect(next.playMode).toBe('sequential');
    expect(next.boardSize).toBe(2);
    expect(next.target).toBe(8);
  });

  it('rolls over to the next board size after finishing the sequential board maximum', () => {
    const state = createGameState({ boardSize: 2, playMode: 'sequential', target: 40, status: 'celebrating' });
    const next = gameReducer(state, { type: 'round/finished' });

    expect(next.status).toBe('playing');
    expect(next.playMode).toBe('sequential');
    expect(next.boardSize).toBe(3);
    expect(next.target).toBe(1);
    expect(computeCurrentSum(next.cells)).toBe(0);
  });

  it('enters celebrating on a winning tap and blocks later actions until the round finishes', () => {
    const winningState = createGameState({ boardSize: 2, playMode: 'sequential', target: 1 });
    const celebratingState = gameReducer(winningState, { type: 'cell/tapped', index: 0 });

    expect(celebratingState.status).toBe('celebrating');

    const blockedBoardChange = gameReducer(celebratingState, { type: 'board/selected', boardSize: 3 });
    const blockedModeToggle = gameReducer(celebratingState, { type: 'mode/toggled', enabled: false });
    const blockedTap = gameReducer(celebratingState, { type: 'cell/tapped', index: 1 });

    expect(blockedBoardChange).toBe(celebratingState);
    expect(blockedModeToggle).toBe(celebratingState);
    expect(blockedTap).toBe(celebratingState);
  });
});
