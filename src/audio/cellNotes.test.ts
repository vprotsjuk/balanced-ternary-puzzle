import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  __resetCellStateAudioForTests,
  getCellStateNoteFrequency,
  getCellStateNoteSlot,
  playCellStateNote,
  primeCellStateAudio,
} from './cellNotes';

afterEach(() => {
  __resetCellStateAudioForTests();
  vi.unstubAllGlobals();
});

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

  it('plays the first queued note after the audio context unlock resolves', async () => {
    const oscillator = {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      addEventListener: vi.fn(),
    };
    const gainNode = {
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
    let resumeResolver: () => void = () => {
      throw new Error('resume resolver was not captured');
    };
    const context = {
      state: 'suspended' as const,
      currentTime: 12,
      destination: {},
      createOscillator: vi.fn(() => oscillator),
      createGain: vi.fn(() => gainNode),
      resume: vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resumeResolver = () => {
              (context as { state: 'running' | 'suspended' }).state = 'running';
              resolve();
            };
          }),
      ),
    };

    vi.stubGlobal('AudioContext', vi.fn(() => context));
    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      value: vi.fn(() => context),
    });

    primeCellStateAudio();
    playCellStateNote(0, 'plus');

    expect(context.createOscillator).not.toHaveBeenCalled();

    resumeResolver();
    await Promise.resolve();
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(context.createOscillator).toHaveBeenCalledTimes(1);
    expect(oscillator.frequency.setValueAtTime).toHaveBeenCalled();
    expect(oscillator.start).toHaveBeenCalledWith(12);
  });
});
