import type { CellState } from '../game/types';
import { AdaptiveNumber } from './AdaptiveNumber';

export function BoardCell({
  value,
  state,
  disabled,
  flash,
  onPress,
}: {
  value: number;
  state: CellState;
  disabled: boolean;
  flash: boolean;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      className={`board-cell board-cell--${state}${flash ? ' board-cell--flash' : ''}`}
      aria-label={`Cell ${value}, ${state}`}
      disabled={disabled}
      onClick={onPress}
    >
      <AdaptiveNumber value={value} mode="cell" />
    </button>
  );
}
