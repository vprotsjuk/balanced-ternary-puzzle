import type { Cell } from '../game/types';
import type { BoardSize } from '../game/types';

export function BoardGrid({
  boardSize,
  cells,
  blocked,
  onCellTap,
}: {
  boardSize: BoardSize;
  cells: Cell[];
  blocked: boolean;
  onCellTap: (index: number) => void;
}) {
  return (
    <section className="board-grid" aria-label="Board grid" data-board-size={boardSize}>
      <span className="board-grid__placeholder">Temporary tap grid: {blocked ? 'locked' : 'ready'}</span>
      <div
        className="board-grid__cells"
        style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
      >
        {cells.map((cell, index) => (
          <button
            key={cell.value}
            type="button"
            className="chip board-grid__cell"
            onClick={() => onCellTap(index)}
            disabled={blocked}
            aria-label={`Cell ${index + 1}, value ${cell.value}, ${cell.state}`}
          >
            {cell.value}
          </button>
        ))}
      </div>
    </section>
  );
}
