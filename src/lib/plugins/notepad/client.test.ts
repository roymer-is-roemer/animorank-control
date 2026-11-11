import { describe, expect, it, vi } from 'vitest';
import { ClientAnimoRankAPI } from '$lib/api/client';
import { ClientRegistryProvider } from '$lib/registry/client';
import { SolveWindowRegistry } from '../../../routes/problem/[problem_id]/[session_id]/windowRegistry';
import type { SolveWindowContext } from '../../../routes/problem/[problem_id]/[session_id]/context.svelte';
import NotepadClientPlugin from './client';

describe('NotepadClientPlugin', () => {
  it('registers its window and opens it as an unfocused right-hand column', async () => {
    const plugin = new NotepadClientPlugin();
    await plugin.init(new ClientAnimoRankAPI('notepad', 'http://localhost/'));

    const registry = ClientRegistryProvider.instance().getRegistry(SolveWindowRegistry);
    expect(registry.keys()).toContain('notepad:notepad');

    const openWindow = vi.fn(async () => ({}));
    await plugin.onSolvePageLoad({ openWindow } as unknown as SolveWindowContext);

    // To the right of the editor, and without taking the keyboard from it: the
    // notepad is furniture, not something the student just asked to open.
    expect(openWindow).toHaveBeenCalledWith(
      'notepad:notepad',
      { direction: 'right', referencePanel: 'code_editor' },
      { activate: false }
    );
  });
});
