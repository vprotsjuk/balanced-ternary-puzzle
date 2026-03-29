import {
  buildCellValues,
  computeCurrentSum,
  cycleBoardSize,
  getBoardRangeLabel,
  parseManualTarget,
  randomTarget,
  cycleCellState,
} from '../board';

describe('board utilities', () => {
  it('builds ascending powers of 3 for the active board size', () => {
    expect(buildCellValues(2)).toEqual([1, 3, 9, 27]);
    expect(buildCellValues(3).slice(0, 4)).toEqual([1, 3, 9, 27]);
  });

  it('returns exact target ranges for each board', () => {
    expect(getBoardRangeLabel(2)).toBe('1..40');
    expect(getBoardRangeLabel(3)).toBe('1..9841');
    expect(getBoardRangeLabel(4)).toBe('1..21523360');
  });

  it('parses trimmed positive integers and rejects invalid input', () => {
    expect(parseManualTarget(' 0042 ', 3)).toBe(42);
    expect(parseManualTarget('', 3)).toBeNull();
    expect(parseManualTarget('1.5', 3)).toBeNull();
    expect(parseManualTarget('-3', 3)).toBeNull();
    expect(parseManualTarget('9842', 3)).toBeNull();
  });

  it('cycles board sizes in the documented order', () => {
    expect(cycleBoardSize(2)).toBe(3);
    expect(cycleBoardSize(3)).toBe(4);
    expect(cycleBoardSize(4)).toBe(2);
  });

  it('cycles cell states neutral -> plus -> minus -> neutral', () => {
    expect(cycleCellState('neutral')).toBe('plus');
    expect(cycleCellState('plus')).toBe('minus');
    expect(cycleCellState('minus')).toBe('neutral');
  });

  it('computes the signed sum from cell states', () => {
    expect(
      computeCurrentSum([
        { value: 1, state: 'plus' },
        { value: 3, state: 'minus' },
        { value: 9, state: 'neutral' },
      ]),
    ).toBe(-2);
  });

  it('supports deterministic random target generation through an injected rng', () => {
    expect(randomTarget(2, () => 0)).toBe(1);
    expect(randomTarget(2, () => 0.999999)).toBe(40);
  });
});
