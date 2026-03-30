import { act, renderHook } from '@testing-library/react';
import { createGameState } from '../state';
import { useBalancedTernaryGame } from '../useBalancedTernaryGame';

describe('useBalancedTernaryGame', () => {
  it('starts from the deterministic default state', () => {
    const { result } = renderHook(() => useBalancedTernaryGame());

    expect(result.current.state).toEqual(createGameState());
  });

  it('exposes an explicit random celebration branch', () => {
    const initialState = createGameState({
      boardSize: 2,
      playMode: 'random',
      target: 7,
      status: 'celebrating',
    });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState));

    act(() => {
      result.current.finishCelebrationRandom(21);
    });

    expect(result.current.state.status).toBe('playing');
    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(21);
  });

  it('exposes an explicit sequential celebration branch', () => {
    const initialState = createGameState({
      boardSize: 2,
      playMode: 'sequential',
      target: 7,
      status: 'celebrating',
    });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState));

    act(() => {
      result.current.finishCelebrationSequential();
    });

    expect(result.current.state.status).toBe('playing');
    expect(result.current.state.playMode).toBe('sequential');
    expect(result.current.state.target).toBe(8);
  });

  it('requires explicit random targets when selecting a board in random mode', () => {
    const initialState = createGameState({ boardSize: 2, playMode: 'random', target: 7 });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState));

    act(() => {
      result.current.selectBoardSize(3, 22);
    });

    expect(result.current.state.boardSize).toBe(3);
    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(22);
  });

  it('ignores the explicit board target when selecting a board in sequential mode', () => {
    const initialState = createGameState({ boardSize: 2, playMode: 'sequential', target: 7 });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState));

    act(() => {
      result.current.selectBoardSize(3, 22);
    });

    expect(result.current.state.boardSize).toBe(3);
    expect(result.current.state.playMode).toBe('sequential');
    expect(result.current.state.target).toBe(1);
  });

  it('supports explicit random mode enable and disable branches', () => {
    const initialState = createGameState({ boardSize: 2, playMode: 'sequential', target: 7 });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState));

    act(() => {
      result.current.enableRandomMode({ 2: 11, 3: 22, 4: 33 });
    });

    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(11);

    act(() => {
      result.current.disableRandomMode();
    });

    expect(result.current.state.playMode).toBe('sequential');
  });
});
