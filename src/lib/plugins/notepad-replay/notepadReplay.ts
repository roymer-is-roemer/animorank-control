import type { SessionLogEntry } from '$lib/analytics/sessionLogView';
import { applyNotepadDelta, NOTEPAD_TEXT_MODIFIED, type NotepadTextEvent } from '$lib/telemetry/types/notepadEvent';

export interface NotepadDelta extends NotepadTextEvent {
  timestamp: string;
}

/** Keep only well-formed notepad changes; `entries` must be oldest first. */
export function notepadDeltas(entries: SessionLogEntry[]): NotepadDelta[] {
  const deltas: NotepadDelta[] = [];
  for (const entry of entries) {
    if (entry.type !== NOTEPAD_TEXT_MODIFIED) continue;
    const data = entry.data;
    if (!data || typeof data !== 'object' || Array.isArray(data)) continue;
    const { offset, old, new: inserted } = data as Record<string, unknown>;
    if (typeof offset !== 'number' || typeof old !== 'string' || typeof inserted !== 'string') continue;
    deltas.push({ timestamp: entry.timestamp, offset, old, new: inserted });
  }
  return deltas;
}

/** Index 0 is the blank first page; index i is the note after delta i - 1. */
export function notepadTexts(deltas: NotepadDelta[], base = ''): string[] {
  const texts = [base];
  let text = base;
  for (const delta of deltas) {
    text = applyNotepadDelta(text, delta);
    texts.push(text);
  }
  return texts;
}
