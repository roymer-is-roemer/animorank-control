import { describe, expect, it } from 'vitest';
import type { SessionLogEntry } from '$lib/analytics/sessionLogView';
import { NOTEPAD_TEXT_MODIFIED } from '$lib/telemetry/types/notepadEvent';
import { notepadDeltas, notepadTexts } from './notepadReplay';

let nextId = 0;
const entry = (type: string, data: unknown): SessionLogEntry => ({
  id: `entry-${(nextId += 1)}`,
  timestamp: '2026-01-01T00:00:00.000Z',
  type,
  data: data as SessionLogEntry['data']
});

describe('notepadDeltas', () => {
  it('ignores entries of other types', () => {
    const deltas = notepadDeltas([
      entry('TEXT_MODIFIED', { offset: 0, old: '', new: 'x' }),
      entry(NOTEPAD_TEXT_MODIFIED, { offset: 0, old: '', new: 'a' }),
      entry('RUN_ATTEMPT', { runType: 'run' })
    ]);

    expect(deltas).toEqual([{ timestamp: '2026-01-01T00:00:00.000Z', offset: 0, old: '', new: 'a' }]);
  });

  it('ignores a payload that is not an offset/old/new triple', () => {
    const deltas = notepadDeltas([
      entry(NOTEPAD_TEXT_MODIFIED, { offset: '0', old: '', new: 'a' }),
      entry(NOTEPAD_TEXT_MODIFIED, { offset: 0, old: '', new: 7 }),
      entry(NOTEPAD_TEXT_MODIFIED, null),
      entry(NOTEPAD_TEXT_MODIFIED, [0, '', 'a']),
      entry(NOTEPAD_TEXT_MODIFIED, { offset: 0, old: '', new: 'b' })
    ]);

    expect(deltas.map((delta) => delta.new)).toEqual(['b']);
  });
});

describe('notepadTexts', () => {
  it('reconstructs the note step by step', () => {
    const deltas = notepadDeltas([
      entry(NOTEPAD_TEXT_MODIFIED, { offset: 0, old: '', new: 'a' }),
      entry(NOTEPAD_TEXT_MODIFIED, { offset: 1, old: '', new: 'b' }),
      entry(NOTEPAD_TEXT_MODIFIED, { offset: 1, old: 'b', new: '' })
    ]);

    expect(notepadTexts(deltas)).toEqual(['', 'a', 'ab', 'a']);
  });

  it('starts from the base it is given', () => {
    const deltas = notepadDeltas([entry(NOTEPAD_TEXT_MODIFIED, { offset: 2, old: '', new: '!' })]);

    expect(notepadTexts(deltas, 'hi')).toEqual(['hi', 'hi!']);
  });

  it('is the single blank page when there are no deltas', () => {
    expect(notepadTexts([])).toEqual(['']);
  });
});
