import { act, renderHook } from '@testing-library/react';
import { randomTarget } from '../board';
import { createGameState } from '../state';
import { useBalancedTernaryGame } from '../useBalancedTernaryGame';

describe('useBalancedTernaryGame', () => {
  it('uses the injected rng for deterministic random initialization', () => {
    const rng = () => 0.5;
    const { result } = renderHook(() => useBalancedTernaryGame(undefined, rng));

    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(21);
  });

  it('uses the injected rng for random round rollover', () => {
    const rng = () => 0.5;
    const initialState = createGameState({
      boardSize: 2,
      playMode: 'random',
      target: 7,
      status: 'celebrating',
    });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState, rng));

    act(() => {
      result.current.finishCelebration();
    });

    expect(result.current.state.status).toBe('playing');
    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(21);
  });

  it('does not consume rng when finishing a sequential celebration', () => {
    let calls = 0;
    const rng = () => {
      calls += 1;
      return 0.5;
    };
    const initialState = createGameState({
      boardSize: 2,
      playMode: 'sequential',
      target: 7,
      status: 'celebrating',
    });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState, rng));

    act(() => {
      result.current.finishCelebration();
    });

    expect(calls).toBe(0);
    expect(result.current.state.status).toBe('playing');
    expect(result.current.state.playMode).toBe('sequential');
    expect(result.current.state.target).toBe(8);
  });

  it('consumes exactly one rng sample when finishing a random celebration', () => {
    let calls = 0;
    const rng = () => {
      calls += 1;
      return 0.5;
    };
    const initialState = createGameState({
      boardSize: 2,
      playMode: 'random',
      target: 7,
      status: 'celebrating',
    });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState, rng));

    act(() => {
      result.current.finishCelebration();
    });

    expect(calls).toBe(1);
    expect(result.current.state.status).toBe('playing');
    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(21);
  });

  it('keeps the selected board size and target aligned when random mode toggles before selection', () => {
    const rng = () => 0.5;
    const expectedTarget = randomTarget(3, rng);
    const initialState = createGameState({ boardSize: 2, playMode: 'sequential', target: 1 });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState, rng));

    act(() => {
      result.current.setRandomMode(true);
      result.current.selectBoardSize(3);
    });

    expect(result.current.state.boardSize).toBe(3);
    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(expectedTarget);
  });

  it('keeps the selected board size and target aligned when board selection happens before random mode toggles', () => {
    const rng = () => 0.5;
    const expectedTarget = randomTarget(3, rng);
    const initialState = createGameState({ boardSize: 2, playMode: 'sequential', target: 1 });
    const { result } = renderHook(() => useBalancedTernaryGame(initialState, rng));

    act(() => {
      result.current.selectBoardSize(3);
      result.current.setRandomMode(true);
    });

    expect(result.current.state.boardSize).toBe(3);
    expect(result.current.state.playMode).toBe('random');
    expect(result.current.state.target).toBe(expectedTarget);
  });
});
