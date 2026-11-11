import { Window } from '$lib/window';
import type { SolveWindowContext } from '../../../routes/problem/[problem_id]/[session_id]/context.svelte';
import Notepad from './Notepad.window.svelte';

export class NotepadWindow extends Window<SolveWindowContext> {
  static title = 'Notepad';
  static closeable = false;
  constructor(context: SolveWindowContext) {
    super({ title: NotepadWindow.title, closable: NotepadWindow.closeable, context }, Notepad);
  }
}
