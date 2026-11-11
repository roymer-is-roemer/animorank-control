import { describe, expect, it } from 'vitest';
import { applyNotepadDelta, notepadDelta } from './notepadEvent';

describe('notepadDelta', () => {
  it('reports an insertion as the inserted text at its position', () => {
    expect(notepadDelta('abcd', 'abXcd')).toEqual({ offset: 2, old: '', new: 'X' });
  });

  it('reports a deletion as the removed text at its position', () => {
    expect(notepadDelta('abXcd', 'abcd')).toEqual({ offset: 2, old: 'X', new: '' });
  });

  it('reports a replacement as the whole changed middle', () => {
    expect(notepadDelta('hello world', 'hello there')).toEqual({ offset: 6, old: 'world', new: 'there' });
  });

  it('treats a paste as one delta spanning everything inserted', () => {
    expect(notepadDelta('a', 'a paste of several lines')).toEqual({
      offset: 1,
      old: '',
      new: ' paste of several lines'
    });
  });

  it('reports nothing when the text did not change', () => {
    expect(notepadDelta('same', 'same')).toBeNull();
  });

  it('reports typing into an empty note as one insertion', () => {
    expect(notepadDelta('', 'hello')).toEqual({ offset: 0, old: '', new: 'hello' });
  });
});

describe('applyNotepadDelta', () => {
  it('round-trips every delta notepadDelta reports', () => {
    const pairs: [string, string][] = [
      ['', 'hello'],
      ['hello', 'hello world'],
      ['hello world', 'hello there'],
      ['hello there', 'hello'],
      ['abc\n', 'abc\ndef']
    ];
    for (const [before, after] of pairs) {
      const delta = notepadDelta(before, after);
      if (!delta) throw new Error(`${before} and ${after} should differ`);
      expect(applyNotepadDelta(before, delta)).toBe(after);
    }
  });

  it('clamps an offset past the end of the text', () => {
    expect(applyNotepadDelta('abc', { offset: 99, old: '', new: '!' })).toBe('abc!');
  });
});
