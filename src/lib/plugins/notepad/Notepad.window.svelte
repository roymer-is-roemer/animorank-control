<script lang="ts">
  import Textarea from '$lib/components/ui/textareas/Textarea.svelte';
  import type { SolveWindowContext } from '../../../routes/problem/[problem_id]/[session_id]/context.svelte';

  let { context }: { context: SolveWindowContext } = $props();

  const SAVE_LABELS = {
    error: { text: 'Notepad not saved', class: 'text-error' },
    saving: { text: 'Saving...', class: 'text-warning' },
    hold: { text: 'Unsaved changes', class: 'text-base-content/50' },
    saved: { text: 'Notepad saved', class: 'text-success' }
  } as const;

  let saveLabel = $derived(SAVE_LABELS[context.notepadSaveState]);
</script>

<div class="flex h-full w-full flex-col">
  <div class="flex h-8 shrink-0 items-center justify-between border-b border-base-100 bg-base-200 px-2">
    <span class="text-xs font-medium text-base-content/70">Notepad</span>
    <span
      class="text-xs {saveLabel.class}"
      aria-live="polite">{saveLabel.text}</span
    >
  </div>
  <Textarea
    class="h-full w-full flex-1 resize-none rounded-none border-0 bg-base-100 p-3 font-mono text-sm focus:outline-none"
    value={context.notepad}
    oninput={(event) => context.updateNotepad(event.currentTarget.value)}
    placeholder="Scratch notes for this problem..."
    aria-label="Notepad"
    spellcheck="false"
  />
</div>
