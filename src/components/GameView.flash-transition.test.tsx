import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createGameState } from '../game/state';

const boardRenderLog: Array<{ blocked: boolean; flash: boolean }> = [];

vi.mock('./StatusStrip', () => ({
  StatusStrip: ({ flash }: { flash: boolean }) => <div data-testid="status-strip" data-flash={flash} />,
}));

vi.mock('./ControlPanel', () => ({
  ControlPanel: () => <div data-testid="control-panel" />,
}));

vi.mock('./BoardGrid', () => ({
  BoardGrid: ({
    blocked,
    flash,
    onCellTap,
  }: {
    blocked: boolean;
    flash: boolean;
    onCellTap: (index: number) => void;
  }) => {
    boardRenderLog.push({ blocked, flash });

    return (
      <button
        type="button"
        data-testid="board-grid"
        data-blocked={blocked}
        data-flash={flash}
        onClick={() => onCellTap(0)}
      >
        Tap
      </button>
    );
  },
}));

import { GameView } from './GameView';

beforeEach(() => {
  boardRenderLog.length = 0;
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it('starts the celebration flash on the first winning render instead of one render later', () => {
  render(
    <GameView
      initialState={createGameState({
        boardSize: 2,
        playMode: 'sequential',
        target: 1,
      })}
    />,
  );

  fireEvent.click(screen.getByTestId('board-grid'));

  const celebratingRenders = boardRenderLog.filter((entry) => entry.blocked);
  expect(celebratingRenders.length).toBeGreaterThan(0);
  expect(celebratingRenders[0]).toEqual({ blocked: true, flash: true });
  expect(celebratingRenders.every((entry) => entry.flash)).toBe(true);
});
