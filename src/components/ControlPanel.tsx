import { BOARD_SIZES } from '../game/config';
import type { PlayMode } from '../game/state';
import type { BoardSize } from '../game/types';

export function ControlPanel({
  layout = 'desktop',
  boardSize,
  playMode,
  draftTarget,
  placeholder,
  blocked,
  onSelectBoardSize,
  onEnableRandomMode,
  onDisableRandomMode,
  onDraftChange,
  onSubmitTarget,
}: {
  layout?: 'desktop' | 'mobile';
  boardSize: BoardSize;
  playMode: PlayMode;
  draftTarget: string;
  placeholder: string;
  blocked: boolean;
  onSelectBoardSize: (boardSize: BoardSize) => void;
  onEnableRandomMode: () => void;
  onDisableRandomMode: () => void;
  onDraftChange: (value: string) => void;
  onSubmitTarget: (raw: string) => void;
}) {
  const randomToggle = (
    <button
      type="button"
      className="random-toggle"
      aria-pressed={playMode === 'random'}
      onClick={() => (playMode === 'random' ? onDisableRandomMode() : onEnableRandomMode())}
      disabled={blocked}
    >
      Random {playMode === 'random' ? 'ON' : 'OFF'}
    </button>
  );

  return (
    <section
      className={`control-panel control-panel--${layout}`}
      aria-label="Game controls"
      aria-disabled={blocked}
    >
      <div className={`control-panel__top-row control-panel__top-row--${layout}`}>
        <div className="board-size-row" role="group" aria-label="Board size">
          {BOARD_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={boardSize === size ? 'chip chip--active' : 'chip'}
              onClick={() => onSelectBoardSize(size)}
              disabled={blocked}
            >
              {size}x{size}
            </button>
          ))}
          {layout === 'mobile' ? randomToggle : null}
        </div>
        {layout === 'desktop' ? randomToggle : null}
      </div>

      <div className="target-entry">
        <label className="target-label" htmlFor="manual-target">
          Value
        </label>
        <div className="target-entry-row">
          <input
            id="manual-target"
            value={draftTarget}
            placeholder={placeholder}
            onChange={(event) => onDraftChange(event.target.value)}
            disabled={blocked}
            inputMode="numeric"
          />
          <button type="button" onClick={() => onSubmitTarget(draftTarget)} disabled={blocked}>
            Enter
          </button>
        </div>
      </div>
    </section>
  );
}
