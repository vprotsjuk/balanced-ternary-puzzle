import { act, renderHook } from '@testing-library/react';
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
});
