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

  it('cycles a tapped cell through neutral, plus, and minus', () => {
    const state = createGameState({ boardSize: 2, playMode: 'sequential', target: 40 });
    const plusState = gameReducer(state, { type: 'cell/tapped', index: 0 });
    const minusState = gameReducer(plusState, { type: 'cell/tapped', index: 0 });

    expect(plusState.cells[0].state).toBe('plus');
    expect(minusState.cells[0].state).toBe('minus');
  });
});
