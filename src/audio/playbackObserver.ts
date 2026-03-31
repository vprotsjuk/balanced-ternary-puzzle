import type { GameState } from '../game/state';
import { getCellStateNoteSlot } from './cellNotes';

export function getCommittedCellStateNote(previous: GameState, next: GameState) {
  if (
    previous.boardSize !== next.boardSize ||
    previous.cells.length !== next.cells.length ||
    previous.target !== next.target
  ) {
    return null;
  }

  let changedIndex = -1;

  for (let index = 0; index < next.cells.length; index += 1) {
    if (previous.cells[index].state === next.cells[index].state) {
      continue;
    }

    if (changedIndex !== -1) {
      return null;
    }

    changedIndex = index;
  }

  if (changedIndex === -1) {
    return null;
  }

  const state = next.cells[changedIndex].state;

  return {
    cellIndex: changedIndex,
    slot: getCellStateNoteSlot(changedIndex, state),
    state,
  };
}
