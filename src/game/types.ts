export type BoardSize = 2 | 3 | 4;
export type CellState = 'neutral' | 'plus' | 'minus';

export interface Cell {
  value: number;
  state: CellState;
}
