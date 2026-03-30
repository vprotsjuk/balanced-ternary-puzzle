import type { Cell } from '../game/types';
import type { BoardSize } from '../game/types';

export function BoardGrid({
  boardSize,
  cells,
  blocked,
}: {
  boardSize: BoardSize;
  cells: Cell[];
  blocked: boolean;
  onCellTap: (index: number) => void;
}) {
  return (
    <section className="board-grid" aria-label="Board grid" data-board-size={boardSize}>
      <span className="board-grid__placeholder">
        {cells.length} cells {blocked ? 'locked' : 'ready'}
      </span>
    </section>
  );
}
