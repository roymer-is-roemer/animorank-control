/** History-entry type for one notepad text change. Separate from TEXT_MODIFIED,
 *  which the code replay interprets as a delta into the code document. */
export const NOTEPAD_TEXT_MODIFIED = 'NOTEPAD_TEXT_MODIFIED';

/** One notepad change: `new` replaces `old` at `offset`. */
export interface NotepadTextEvent {
  offset: number;
  old: string;
  new: string;
}

/**
 * The changed span between two notepad values: the common prefix and suffix are
 * kept, and the middle is the delta. `null` when the values are equal.
 */
export function notepadDelta(before: string, after: string): NotepadTextEvent | null {
  if (before === after) return null;
  let start = 0;
  const shortest = Math.min(before.length, after.length);
  while (start < shortest && before[start] === after[start]) start += 1;
  let beforeEnd = before.length;
  let afterEnd = after.length;
  while (beforeEnd > start && afterEnd > start && before[beforeEnd - 1] === after[afterEnd - 1]) {
    beforeEnd -= 1;
    afterEnd -= 1;
  }
  return { offset: start, old: before.slice(start, beforeEnd), new: after.slice(start, afterEnd) };
}

/** Apply one delta; an offset past either end is clamped, as in the code replay. */
export function applyNotepadDelta(text: string, event: NotepadTextEvent): string {
  const offset = Math.min(Math.max(0, event.offset), text.length);
  return text.slice(0, offset) + event.new + text.slice(offset + event.old.length);
}
