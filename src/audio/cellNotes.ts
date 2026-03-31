import type { CellState } from '../game/types';

const SLOT_COUNT = 48;
const BASE_MIDI_NOTE = 48;
const NOTE_DURATION_SECONDS = 0.18;
const ATTACK_SECONDS = 0.01;
const RELEASE_SECONDS = 0.12;
const PEAK_GAIN = 0.08;

const SLOT_OFFSET_BY_STATE: Record<CellState, number> = {
  minus: 0,
  neutral: 1,
  plus: 2,
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContextCtor = window.AudioContext ?? (window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  }).webkitAudioContext;

  if (!AudioContextCtor) {
    return null;
  }

  audioContext ??= new AudioContextCtor();
  return audioContext;
}

export function getCellStateNoteSlot(cellIndex: number, state: CellState): number {
  const slot = cellIndex * 3 + SLOT_OFFSET_BY_STATE[state];

  if (slot < 0 || slot >= SLOT_COUNT) {
    throw new Error(`Invalid cell note slot: ${slot}`);
  }

  return slot;
}

export function getCellStateNoteFrequency(cellIndex: number, state: CellState): number {
  const midi = BASE_MIDI_NOTE + getCellStateNoteSlot(cellIndex, state);
  return 440 * 2 ** ((midi - 69) / 12);
}

export function primeCellStateAudio() {
  const context = getAudioContext();
  if (!context || context.state !== 'suspended') {
    return;
  }

  void context.resume();
}

export function playCellStateNote(cellIndex: number, state: CellState) {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (context.state === 'suspended') {
    return;
  }

  const startTime = context.currentTime;
  const stopTime = startTime + NOTE_DURATION_SECONDS;
  const gainNode = context.createGain();
  const oscillator = context.createOscillator();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(getCellStateNoteFrequency(cellIndex, state), startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.linearRampToValueAtTime(PEAK_GAIN, startTime + ATTACK_SECONDS);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime + RELEASE_SECONDS);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(stopTime);
  oscillator.addEventListener(
    'ended',
    () => {
      oscillator.disconnect();
      gainNode.disconnect();
    },
    { once: true },
  );
}
