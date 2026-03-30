import {
  createNeutralCells,
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
    expect(buildCellValues(3)).toEqual([
      1,
      3,
      9,
      27,
      81,
      243,
      729,
      2187,
      6561,
    ]);
    expect(buildCellValues(4)).toEqual([
      1,
      3,
      9,
      27,
      81,
      243,
      729,
      2187,
      6561,
      19683,
      59049,
      177147,
      531441,
      1594323,
      4782969,
      14348907,
    ]);
  });

  it('creates neutral cells for the active board size', () => {
    expect(createNeutralCells(2)).toEqual([
      { value: 1, state: 'neutral' },
      { value: 3, state: 'neutral' },
      { value: 9, state: 'neutral' },
      { value: 27, state: 'neutral' },
    ]);
    expect(createNeutralCells(4)).toHaveLength(16);
    expect(createNeutralCells(4)[15]).toEqual({ value: 14348907, state: 'neutral' });
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

  it('rejects invalid runtime board sizes instead of normalizing them', () => {
    expect(() => cycleBoardSize(99 as never)).toThrow('Invalid board size: 99');
    expect(() => buildCellValues(99 as never)).toThrow('Invalid board size: 99');
    expect(() => createNeutralCells(99 as never)).toThrow('Invalid board size: 99');
    expect(() => getBoardRangeLabel(99 as never)).toThrow('Invalid board size: 99');
    expect(() => parseManualTarget('1', 99 as never)).toThrow('Invalid board size: 99');
    expect(() => randomTarget(99 as never, () => 0)).toThrow('Invalid board size: 99');
  });

  it('rejects stringified runtime board sizes instead of coercing them', () => {
    expect(() => cycleBoardSize('2' as never)).toThrow('Invalid board size: 2');
    expect(() => buildCellValues('3' as never)).toThrow('Invalid board size: 3');
    expect(() => getBoardRangeLabel('4' as never)).toThrow('Invalid board size: 4');
  });

  it('cycles cell states neutral -> plus -> minus -> neutral', () => {
    expect(cycleCellState('neutral')).toBe('plus');
    expect(cycleCellState('plus')).toBe('minus');
    expect(cycleCellState('minus')).toBe('neutral');
  });

  it('rejects invalid runtime cell states instead of normalizing them', () => {
    expect(() => cycleCellState('broken' as never)).toThrow('Invalid cell state: broken');
    expect(() =>
      computeCurrentSum([{ value: 1, state: 'broken' as never }]),
    ).toThrow('Invalid cell state: broken');
  });

  it('rejects malformed runtime cell values instead of producing nonsense', () => {
    expect(() =>
      computeCurrentSum([{ value: '1' as never, state: 'plus' }]),
    ).toThrow('Invalid cell value: 1');
    expect(() =>
      computeCurrentSum([{ value: NaN, state: 'minus' }]),
    ).toThrow('Invalid cell value: NaN');
    expect(() =>
      computeCurrentSum([{ value: -3, state: 'plus' }]),
    ).toThrow('Invalid cell value: -3');
    expect(() =>
      computeCurrentSum([{ value: 1.5, state: 'minus' }]),
    ).toThrow('Invalid cell value: 1.5');
    expect(() =>
      computeCurrentSum([{ value: 2, state: 'neutral' }]),
    ).toThrow('Invalid cell value: 2');
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
    expect(randomTarget(2, () => 1)).toBe(40);
    expect(randomTarget(2, () => 0.999999)).toBe(40);
  });

  it('rejects invalid random target samples instead of propagating NaN', () => {
    expect(() => randomTarget(2, () => NaN)).toThrow('Invalid random target sample: NaN');
    expect(() => randomTarget(3, () => Infinity)).toThrow(
      'Invalid random target sample: Infinity',
    );
  });
});
