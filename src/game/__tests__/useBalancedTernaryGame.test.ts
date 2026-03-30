import { act, renderHook } from '@testing-library/react';
import { createGameState } from '../state';
import { useBalancedTernaryGame } from '../useBalancedTernaryGame';

describe('useBalancedTernaryGame', () => {
  it('starts from the deterministic default state without sampling RNG', () => {
    const { result } = renderHook(() => useBalancedTernaryGame());

    expect(result.current.state).toEqual(createGameState());
  });

  it('uses explicit nextTarget values for random celebration rollover', () => {
    const initialState = createGameState({
      boardSize: 2,
      playMode: 'random',
      target: 7,
      status: 'celebrating',
    });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState));

    act(() => {
      result.current.finishCelebration(21);
    });

    expect(result.current.state.status).toBe('playing');
    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(21);
  });

  it('finishes a sequential celebration without requiring random payloads', () => {
    const initialState = createGameState({
      boardSize: 2,
      playMode: 'sequential',
      target: 7,
      status: 'celebrating',
    });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState));

    act(() => {
      result.current.finishCelebration();
    });

    expect(result.current.state.status).toBe('playing');
    expect(result.current.state.playMode).toBe('sequential');
    expect(result.current.state.target).toBe(8);
  });

  it('keeps explicit random payloads aligned when random mode toggles before selection', () => {
    const targetMap = { 2: 11, 3: 22, 4: 33 };
    const initialState = createGameState({ boardSize: 2, playMode: 'sequential', target: 1 });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState));

    act(() => {
      result.current.setRandomMode(true, targetMap);
      result.current.selectBoardSize(3, targetMap[3]);
    });

    expect(result.current.state.boardSize).toBe(3);
    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(22);
  });

  it('keeps explicit random payloads aligned when board selection happens before random mode toggles', () => {
    const targetMap = { 2: 11, 3: 22, 4: 33 };
    const initialState = createGameState({ boardSize: 2, playMode: 'sequential', target: 1 });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState));

    act(() => {
      result.current.selectBoardSize(3, targetMap[3]);
      result.current.setRandomMode(true, targetMap);
    });

    expect(result.current.state.boardSize).toBe(3);
    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(22);
  });
});
