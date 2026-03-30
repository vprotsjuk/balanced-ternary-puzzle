import type { CellState } from '../game/types';

export function BoardCell({
  value,
  state,
  disabled,
  onPress,
}: {
  value: number;
  state: CellState;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      className={`board-cell board-cell--${state}`}
      aria-pressed={state !== 'neutral'}
      aria-label={`Cell ${value}`}
      disabled={disabled}
      onClick={onPress}
    >
      {value}
    </button>
  );
}
