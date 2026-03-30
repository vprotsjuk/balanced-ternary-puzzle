import type { BoardSize, Cell } from '../game/types';
import { BoardCell } from './BoardCell';

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
    <section
      className="board-grid"
      aria-label={`Board ${boardSize} by ${boardSize}`}
      aria-disabled={blocked}
      style={{ ['--board-size' as string]: String(boardSize) }}
    >
      {cells.map((cell, index) => (
        <BoardCell
          key={cell.value}
          value={cell.value}
          state={cell.state}
          disabled={blocked}
          onPress={() => onCellTap(index)}
        />
      ))}
    </section>
  );
}
