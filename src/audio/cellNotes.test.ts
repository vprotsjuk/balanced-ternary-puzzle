import { describe, expect, it } from 'vitest';
import { getCellStateNoteFrequency, getCellStateNoteSlot } from './cellNotes';

describe('cell note mapping', () => {
  it('maps the first cell bottom-up as minus, neutral, plus from C3', () => {
    expect(getCellStateNoteSlot(0, 'minus')).toBe(0);
    expect(getCellStateNoteSlot(0, 'neutral')).toBe(1);
    expect(getCellStateNoteSlot(0, 'plus')).toBe(2);
  });

  it('maps the last 4x4 cell to A6, A#6, and B6', () => {
    expect(getCellStateNoteSlot(15, 'minus')).toBe(45);
    expect(getCellStateNoteSlot(15, 'neutral')).toBe(46);
    expect(getCellStateNoteSlot(15, 'plus')).toBe(47);
  });

  it('converts mapped slots into chromatic equal-temperament frequencies', () => {
    expect(getCellStateNoteFrequency(0, 'minus')).toBeCloseTo(130.81, 2);
    expect(getCellStateNoteFrequency(0, 'neutral')).toBeCloseTo(138.59, 2);
    expect(getCellStateNoteFrequency(15, 'plus')).toBeCloseTo(1975.53, 2);
  });
});
