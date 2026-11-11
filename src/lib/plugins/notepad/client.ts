import type { ClientAnimoRankAPI } from '$lib/api/client';
import { ClientPlugin } from '$lib/plugin/clientPlugin';
import type { SolveWindowRegistry } from '../../../routes/problem/[problem_id]/[session_id]/windowRegistry';
import type { SolveWindowContext } from '../../../routes/problem/[problem_id]/[session_id]/context.svelte';
import { NotepadWindow } from './Notepad.window';

/** The key this plugin's window is registered under, in the plugin's own namespace. */
const VIEW = 'notepad';

/**
 * The student's notepad: a column of its own beside the editor.
 *
 * The note itself — its text, its autosave and the history entries each change
 * records — lives on the solve page's context, because the page's save paths
 * flush it (Ctrl+S, run, submit, leaving the page). This plugin contributes the
 * window that shows it, and the placement of that window.
 */
export default class NotepadClientPlugin extends ClientPlugin {
  private viewKey = VIEW;

  public async init(api: ClientAnimoRankAPI): Promise<void> {
    const registrar = await api.clientRegistryProviderRegistrar.getRegistrarById<SolveWindowRegistry>('window.solve');
    this.viewKey = `${registrar.id}:${VIEW}`;
    registrar.register(VIEW, NotepadWindow);
  }

  public async onSolvePageLoad(context: SolveWindowContext): Promise<void> {
    // Placed to the right of the editor and deliberately not focused: the
    // notepad is furniture beside the work, and taking the keyboard from the
    // code the student opened the page to write would be worse than not
    // showing it.
    //
    // It is opened here rather than placed by the page's default layout,
    // because the page cannot name a window it does not ship. That also means
    // the saved layout is pruned of it before this plugin registers, so a
    // dragged position is not restored; the right-hand column is where it
    // lands every time.
    await context.openWindow(this.viewKey, { direction: 'right', referencePanel: 'code_editor' }, { activate: false });
  }
}
