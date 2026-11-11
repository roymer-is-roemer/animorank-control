import { Window } from '$lib/window';
import type { SessionLogsViewContext } from '../../../routes/instructor/analytics/session-logs/context.svelte';
import Notepad from './Notepad.window.svelte';

export class NotepadWindow extends Window<SessionLogsViewContext> {
  static title = 'Notepad';
  static closeable = false;
  constructor(context: SessionLogsViewContext) {
    super({ title: NotepadWindow.title, closable: NotepadWindow.closeable, context }, Notepad);
  }
}
